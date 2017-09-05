/**
 * Created by MangoTsing on 2017/9/4.
 */
var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var url = "http://crjy.hlju.edu.cn/info/1458/3080.htm";
//��ʼurl

function fetchPage(x) {     //��װ��һ�㺯��
    startRequest(x);
}


function startRequest(x) {
    //����httpģ�������������һ��get����
    http.get(x, function (res) {
        var html = '';        //�����洢������ҳ������html����
        var titles = [];
        res.setEncoding('utf-8'); //��ֹ��������
        //����data�¼���ÿ��ȡһ������
        res.on('data', function (chunk) {
            html += chunk;
        });
        //����end�¼������������ҳ���ݵ�html����ȡ��ϣ���ִ�лص�����
        res.on('end', function () {

            var $ = cheerio.load(html); //����cheerioģ�����html

            var time = $('span.timestyle113332').text().trim();

            var news_item = {
                //��ȡ���µı���
                title: $('td.titlestyle113332').text().trim(),
                //��ȡ���·�����ʱ��
                Time: time,
                //��ȡ��ǰ���µ�url
               // link: "http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                //��ȡ���嵥λ
                author: $('span.wb_content').text().trim(),
                //i�������жϻ�ȡ�˶���ƪ����
                i: i = i + 1,

            };

            console.log(news_item);     //��ӡ������Ϣ
            var news_title = $('td.titlestyle113332').text().trim();

            savedContent($,news_title);  //�洢ÿƪ���µ����ݼ����±���

            //savedImg($,news_title);    //�洢ÿƪ���µ�ͼƬ��ͼƬ����


            //��һƪ���µ�url
            var nextLink="http://crjy.hlju.edu.cn/info/1458/" + $("td.contextstyle113332 a").attr('href');
            console.log(nextLink);
            str1 = nextLink.split('-');  //ȥ����url���������

            str = encodeURI(str1[0]);
            //��������֮һ��ͨ������I,���Կ�����ȡ����ƪ����.
            if (i <= 500) {
                fetchPage(str);
            }

        });

    }).on('error', function (err) {
        console.log(err);
    });

}
//�ú��������ã��ڱ��ش洢����ȡ������������Դ
function savedContent($, news_title) {
    $('td.titlestyle113332').each(function (index, item) {
        var x = $(this).text();
        //console.log(x);
        var y = x.substring(0, 2).trim();
      //  console.log(y);
        if (true) {
          //  console.log('1');
            x = x + '\n';
//�������ı�����һ��һ����ӵ�/data�ļ����£��������ŵı����������ļ�
            fs.appendFile('./data/' + news_title + '.txt', x, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    })
}
//�ú��������ã��ڱ��ش洢����ȡ����ͼƬ��Դ
//function savedImg($,news_title) {
//    $('.article-content img').each(function (index, item) {
//        var img_title = $(this).parent().next().text().trim();  //��ȡͼƬ�ı���
//        if(img_title.length>35||img_title==""){
//            img_title="Null";}
//        var img_filename = img_title + '.jpg';
//
//        var img_src = 'http://www.ss.pku.edu.cn' + $(this).attr('src'); //��ȡͼƬ��url
//
////����requestģ�飬�����������һ�����󣬻�ȡͼƬ��Դ
//        request.head(img_src,function(err,res,body){
//            if(err){
//                console.log(err);
//            }
//        });
//        request(img_src).pipe(fs.createWriteStream('./image/'+news_title + '---' + img_filename));     //ͨ�����ķ�ʽ����ͼƬд������/imageĿ¼�£��������ŵı����ͼƬ�ı�����ΪͼƬ�����ơ�
//    })
//}
fetchPage(url);      //������ʼ����