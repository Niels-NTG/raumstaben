var fs = require('fs-sync');
var path = require('path');
var glob = require('glob');

// generate index.html file with links to all sketches
var sketchFiles = glob.sync('../sketches/*/*');
var sketchList = [];
var sketchCategories = [];
var html = '';
// console.log(sketchFiles);

sketchFiles.forEach(sketchPath => {

    let categoryName = path.basename(path.dirname(sketchPath));

    if (fs.isDir(sketchPath) && fs.exists(path.join(sketchPath, 'sketch.js'))) {

        let relativePath = path.relative('..', sketchPath);
        let viewLink = path.join(relativePath, 'index.html');
        let imageLink = path.join(relativePath, 'export.png');
        let sourceLink = path.join(relativePath, 'sketch.js');
        let sourceFile = fs.read(path.join(sketchPath, 'sketch.js'));
        let sourceHeader = sourceFile.replace(/\n\n(?:.|\n)+/gm, '').replace('//', '').trim();
        let sketchName = path.basename(sketchPath);

        sketchList.push({
            viewLink: viewLink,
            imageLink: imageLink,
            sourceLink: sourceLink,
            sketchHeader: sourceHeader,
            sketchName: sketchName,
            categoryName: categoryName
        });

    } else if (path.extname(sketchPath) === '.md') {

        let categoryAbout = fs.read(sketchPath);
        categoryAbout = categoryAbout.replace(/^#.+?\n/g, '').trim();

        sketchCategories.push({
            categoryName: categoryName,
            categoryAbout: categoryAbout
        });
    }

});
// console.log(sketchList, sketchCategories);

sketchCategories.forEach(sketchCategory => {

    let categorySketches = sketchList.filter(sketch => {
        return sketch.categoryName === sketchCategory.categoryName;
    });

    html += '<div class="category">';
    html += '<p>' + sketchCategory.categoryAbout + '</p>';

    categorySketches.forEach(sketch => {

        html += '<a href="' + sketch.viewLink + '" title="' + sketch.sketchName + '">\n';
        html += '\t<img src="' + sketch.imageLink + '" alt="' + sketch.sketchName +'" />\n';
        html += '\t<span class="btn--link">' + sketch.sketchName + '</span>\n';
        html += '\t<p>' + sketch.sketchHeader + '</p>\n';
        html += '</a>\n';

    });

});

console.log(html);
fs.write('../index.html', html);
