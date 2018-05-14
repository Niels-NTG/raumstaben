var fs = require('fs-sync');
var path = require('path');
var glob = require('glob');
var marked = require('marked');

// generate index.html file with links to all sketches
var sketchFiles = glob.sync('../sketches/*/*');
var sketchList = [];
var sketchCategories = [];
var html = '';

sketchFiles.forEach(sketchPath => {

    let categoryName = path.basename(path.dirname(sketchPath));
    let relativePath = path.relative('..', sketchPath);

    if (fs.isDir(sketchPath) && fs.exists(path.join(sketchPath, 'sketch.js'))) {

        let viewPath = path.join(relativePath, 'index.html');
        let imagePath = fs.exists(path.join(sketchPath, 'export.png')) && path.join(relativePath, 'export.png');
        let sourcePath = path.join(relativePath, 'sketch.js');
        let sourceFile = fs.read(path.join(sketchPath, 'sketch.js'));
        let sourceHeader = sourceFile.replace(/\n\n(?:.|\n)+/gm, '').replace('//', '').trim();
        let sketchName = path.basename(sketchPath);

        sketchList.push({
            viewPath: viewPath,
            imagePath: imagePath,
            sourcePath: sourcePath,
            sketchHeader: sourceHeader,
            sketchName: sketchName,
            categoryName: categoryName
        });

    } else if (path.extname(sketchPath) === '.md') {

        let categoryAbout = fs.read(sketchPath);
        categoryAbout = marked(categoryAbout);
        categoryAbout = categoryAbout.replace(
            /src=['"](.+)?['"]/g,
            'src="' + path.dirname(relativePath) + '/$1"'
        );

        sketchCategories.push({
            categoryName: categoryName,
            categoryAbout: categoryAbout
        });
    }

});

var html = '<head>\n';
html += '\t<link href="styles/list.css" rel="stylesheet" type="text/css">\n';
html += '</head>\n<body>\n';
html += '<h1>RAUMSTABEN</h1>\n';
sketchCategories.forEach(sketchCategory => {

    let categorySketches = sketchList.filter(sketch => {
        return sketch.categoryName === sketchCategory.categoryName;
    });

    html += '<section>\n';
    html += '\t' + sketchCategory.categoryAbout + '\n';

    categorySketches.forEach(sketch => {

        html += '\t<div class="sketch">\n';
        html += '\t\t<div class="sketch__img">';
            if (sketch.imagePath) {
            html += '<img src="' + sketch.imagePath + '" alt="' + sketch.sketchName +'" />';
        }
        html += '</div>\n';
        html += '\t\t<div class="sketch__about">\n';
        html += '\t\t\t<h2>' + sketch.sketchName.replace(/\-/g, ' ') + '</h2>\n'
        html += '\t\t\t' + marked(sketch.sketchHeader) + '\n';
        html += '\t\t\t<a class="btn--link" href="' + sketch.viewPath + '">play</a>\n';
        html += '\t\t</div>\n';
        html += '\t</div>\n';

    });

    html += '</section>\n';

});
html += '</body>';

fs.write('../index.html', html);
