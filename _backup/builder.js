var fs = require('fs'),
  d3 = require('d3'),
  jsdom = require('jsdom');

var replace_string = "<!--CONTENT-->";
var template = fs.readFileSync('atomic.html', "utf8");

var sections = {
  'work':false,
  'education':false,
  'teaching':false,
  'talks':false,
  'publications':false,
  'other':false,
  'skills':false
};

var loadCount = 0;
var loadMax = 0;
var sectionMap = {};
for(var key in sections){ sectionMap[loadMax] = key; loadMax++; }

function load(){
  var i = 0;
  for(var key in sections){
    if(i == loadCount){
      fs.readFile('./data/'+key+'.csv', 'utf8', function (err, data) {
        if(err) console.log(err);

        sections[sectionMap[loadCount]] = d3.csvParse(data);
        
        loadCount++;
        if(loadCount === loadMax){
          build();
        }else{
          load();
        }
      });    
    }
    i++;
  }
}

var window_d3;

function build(){
  var sectionData = [];
  for(var key in sections){sectionData.push({key:key,data:sections[key]});}

  jsdom.env({
    html:'',
    features:{ QuerySelector:true }, //you need query selector for D3 to work
    done:function(errors, window){
      window_d3 = d3.select(window.document); //get d3 into the dom

      var body = window_d3.select('body');

      for(var i = 0; i<sectionData.length; i++){
        var section = sectionData[i].data;
        var container = body.append('section').attr('id','sec-'+sectionData[i].key);
        container.append('h3').text(((i == 5)?'Other Activities':sectionData[i].key));

        switch(sectionData[i].key){
          case 'work':
            section.sort(function(a,b){
              if (a.end>b.end) {
                return -1;
              }else if (a.end<b.end) {
                return 1;
              }else{
                if (a.start>b.start) {
                  return -1;
                }else if (a.start<b.start) {
                  return 1;
                }else{
                  return 0;
                }
              }
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              var time = "";
              if(section[j].start === section[j].end){
                time = section[j].end;
              }else{
                time = section[j].start+" - "+section[j].end;
              }
              tags.append('span').attr('class','tag date').html(time);
              tags.append('span').attr('class','tag geo').html(section[j].location);

              var title = li.append('div').attr('class','title')
              var job = section[j].job;
              if(('link' in section[j]) && section[j].link.length > 1){
                job = '<a href="'+section[j].link+'">'+section[j].job+'</a>';
              }
              title.append('h4').html(job+", ");
              title.append('h5').html(section[j].position);
              if(('examples' in section[j]) && section[j].examples.length >= 1){
                li.append('p').html(section[j].examples);
              }
            }

          break;
          case 'other':
            section.sort(function(a,b){
              if (a.year>b.year) {
                return -1;
              }
              if (a.year<b.year) {
                return 1;
              }
              return 0;
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').text(section[j].year);
              tags.append('span').attr('class','tag geo').text(section[j].location);

              var title = li.append('div').attr('class','title')
              title.append('h4').text(section[j].title+", ");
              title.append('h5').text(section[j].position);
              if(('description' in section[j]) && section[j].description.length >= 1){
                li.append('p').text(section[j].description);
              }
            }

          break;
          case 'education':
            section.sort(function(a,b){
              if (a.end>b.end) {
                return -1;
              }
              if (a.end<b.end) {
                return 1;
              }
              return 0;
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').html(section[j].start+" - "+section[j].end);
              tags.append('span').attr('class','tag geo').html(section[j].location);

              var title = li.append('div').attr('class','title')
              title.append('h4').html(section[j].degree+", ");
              var university = section[j].university;
              if(('link' in section[j]) && section[j].link.length > 1){
                university = '<a href="'+section[j].link+'">'+section[j].university+'</a>';
              }
              title.append('h5').html(section[j].type+", "+university);
              if(('description' in section[j]) && section[j].description.length >= 1){
                var more = "";
                if(('more' in section[j]) && section[j].more.length >= 1){
                  more = ' <a href="'+section[j].more+'">Read&nbsp;more&nbsp;&raquo;</a>';
                }
                li.append('p').html(section[j].description+more);
              }
            }

          break;
          case 'talks':
            section.sort(function(a,b){
              if (a.year>b.year) {
                return -1;
              }
              if (a.year<b.year) {
                return 1;
              }
              return 0;
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').text(section[j].year);
              tags.append('span').attr('class','tag geo').text(section[j].location);

              var title = li.append('div').attr('class','title')
              title.append('h4').text(section[j].title+", ");
              title.append('h5').text(section[j].conference);
            }

          break;
          case 'publications':
            section.sort(function(a,b){
              if (a.year>b.year) {
                return -1;
              }
              if (a.year<b.year) {
                return 1;
              }
              return 0;
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').text(section[j].year);
              tags.append('span').attr('class','tag type').text(section[j].type);

              var title = li.append('div').attr('class','title')
              title.append('h5').text(section[j].authors+", ");
              title.append('h4').text(section[j].title);
              if(('reference' in section[j]) && section[j].reference.length >= 1){
                li.append('p').text(section[j].reference);
              }
            }

          break;
          case 'skills':
            /*section.sort(function(a,b){
              if (a.order<b.order) {
                return -1;
              }
              if (a.order>b.order) {
                return 1;
              }
              return 0;
            });*/

            /*var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').text(section[j].year);
              tags.append('span').attr('class','tag type').text(section[j].type);

              var title = li.append('div').attr('class','title')
              title.append('h5').text(section[j].authors+", ");
              title.append('h4').text(section[j].title);
              if(section[j].reference.length >= 1){
                li.append('p').text(section[j].reference);
              }
            }

            var last_type = '';

            for(var j = 0; j<section.length; j++){

              if(last_type != section[j].type){
                last_type = section[j].type;
                list.append('li').append('strong').text(section[j].type);
              }

              var li = list.append('li').append('div').attr('class','table').append('div').attr('class','tr');
              var td = li.append('div').attr('class','td');
              td.append('span').attr('class','skill').text(section[j].skill);
              var td = li.append('div').attr('class','td');
              td.append('i').html(section[j].level);
            }*/

          break;
          case 'teaching':
            section.sort(function(a,b){
              if (a.year>b.year) {
                return -1;
              }
              if (a.year<b.year) {
                return 1;
              }
              return 0;
            });

            var list = container.append('ul');

            for(var j = 0; j<section.length; j++){
              var li = list.append('li');

              var tags = li.append('div').attr('class','tags');
              tags.append('span').attr('class','tag date').html(section[j].year);
              tags.append('span').attr('class','tag type').html(section[j].type);

              var title = li.append('div').attr('class','title')
              title.append('h4').html(section[j].title+", ");
              title.append('h5').html(section[j].university);
            }
          break;
        }

      }

      fs.writeFileSync('output.html', template.replace(replace_string, window_d3.select('body').html()));
      console.log('DONE');
    }
  });
}

load();