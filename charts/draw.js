const jsdom = require('jsdom');//基于WHATWG DOM和HTML标准的JavaScript实现，用于Node.js。
const d3 = require('d3');
const _ = require('lodash');
const translate = require('./translate.js');
const SVGStyles = require('./svg-styles.js');

const chartWidth = 304;
const chartHeight = 270;

const margin = {
  top: 100,
  right: 48,
  bottom: 50,
  left: 1
};

const plotWidth = chartWidth - margin.left - margin.right;
const plotHeight = chartHeight - margin.top - margin.bottom;

const keyLineLength = 25;
const keyElementHeight = 20;

function convertTime(str) {
  const parse = d3.timeParse('%d %b %Y');//d3 time模块
  const format = d3.timeFormat('%Y年%-m月%-d日');
  return format(parse(str));
}

function draw(data, style=null) {
  return new Promise(function(resolve,reject){
    jsdom.env("<html><body></body></html>",function(err,window) {
      if(err) reject(err);

      window.d3 = d3.select(window.document);//d3之Selections模块
      const body = window.d3.select('body');
      const svg = body.append('svg')//TechTip:如果svg不是根元素，svg 元素可以用于在当前文档（比如说，一个HTML文档）内嵌套一个独立的svg片段 。 这个独立片段拥有独立的视口和坐标系统。
        .attr('xmlns','https://www.w3.org/2000/svg')//TechTip:xml保留属性xmlns用于声明命名空间，'https://www.w3.org/2000/svg'是XML命名空间
        .attr('viewBox',`0 0 ${chartWidth} ${chartHeight}`);//TechTip:viewBox属性的值是一个包含4个参数的列表 min-x, min-y, width and height， 以空格或者逗号分隔开， 在用户空间中指定一个矩形区域映射到给定的元素。

        //MARK: Add styles if exists
        if(style) {
          svg.append('style')
            .text(`/* <![CDATA[ */${style}/* ]]>*/`);//TechTip:style元素元素样式表直接在SVG内容中间嵌入。SVG的style元素的属性与HTML中的相应的元素并无二致。
            //QUEST:这里SVG中嵌入的style元素中必须包含前后的/*..*/？为什么要这样呢（文档中例子也是这么写的）？
        }

        //MARK: Add text
        svg.append('text')//TechTip:text元素定义了一个由文字组成的图形。注意：我们可以将渐变、图案、剪切路径、遮罩或者滤镜应用到text上。
          .classed('chart-title',true)
          /** TechTip:(d3-Modifying Elements):
           * selection.classed(names[,value]):get,add or remove CSS classes
            If the value is truthy, then all elements are assigned the specified classes; otherwise, the classes are unassigned. 
           * 
           */
          .attr('y',22)
          /** TechTip:(d3-Modifying Elements):selection.attr(name[, value]) :If a value is specified, sets the attribute with the specified name to the specified value on the selected elements and returns this selection
           * SVG属性y:该属性在用户坐标系统中标识了一个y轴坐标。本坐标的确切效果依赖于每个元素。大多数时候，它体现了引用元素的矩形区域的左上角的y轴坐标。
           */
          .text(translate(data.title));
          /** TechTip: selection.text([value]):
           * If a value is specified, sets the text content to the specified value on all selected elements, replacing any existing child elements. 

           */
    });
  })
}