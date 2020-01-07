const inquirer = require('inquirer');
const request = require('request');
const cheerio = require('cheerio');
const PDFDocument = require('pdfkit');
const fs = require('fs');

inquirer
  .prompt([
    {
      type: "input",
      message: "What is your user name?",
      name: "username"
    },
    {
      type: "input",
      message: "What is your favorite color?",
      name: "color"
    }
  ])
  .then(function(response) {

    let siteUrl = "https://github.com/"+response.username;
    let favColor = response.color;
    profileGet(siteUrl);
  });
;


function profileGet(urlLink){
    request(urlLink, (error, response, html) =>{
        if(!error&&response.statusCode == 200){
            const $ = cheerio.load(html);

            let fullName = $(".vcard-fullname");
            console.log(fullName.html());
            fullName = fullName.html();
            let image = $(".u-photo");
            image = image.attr("href");
            console.log(image);
            let place = $(".octicon-location").parent();
            place = place.children("span");
            console.log(place.html());
            place = place.html();

            let website = $(".octicon-link").parent();
            website = website.children("a");
            console.log(website.html());
            website = website.html();
            let numRepos = $(".Counter").eq(0);
            console.log(numRepos.html());
            numRepos = numRepos.html();
            let numFollows = $(".Counter").eq(3);
            console.log(numFollows.html());
            numFollows = numFollows.html();
            let numStars = $(".Counter").eq(2);
            console.log(numStars.html());
            numStars = numStars.html();
            let numFollowing = $(".Counter").eq(4);
            console.log(numFollowing.html());
            numFollowing = numFollowing.html();

            logData(fullName,image,place,urlLink,website,numRepos,numFollows,numStars,numFollowing);
        }else{
            console.log("Error: Profile does not exist.");
        }
    });
};

function logData(userName, profilePic, location, githubProf, blog, repos, followers, stars, following){
    const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream('templates/output.pdf'));

        doc.image(profilePic, {
            fit: [250, 300],
            align: 'center',
            valign: 'center'
        });

        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(25)
            .text(userName, 100, 100);

        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text(location, 100, 100);

        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text('Github', 100, 100)
            .underline(100, 100, 160, 27, { color: '#0000FF' })
            .link(100, 100, 160, 27, githubProf);

        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text('Website', 100, 100)
            .underline(100, 100, 160, 27, { color: '#0000FF' })
            .link(100, 100, 160, 27, blog);
        
        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text("Number of Public Repositories: " + repos, 100, 100);

        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text("Number of Followers: " + followers, 100, 100);
        
        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text("Number of Github Stars: " + stars, 100, 100);
        
        doc
            .font('fonts/Times-Roman.ttf')
            .fontSize(14)
            .text("Number of People Followed: " + following, 100, 100);

    doc.end();
};