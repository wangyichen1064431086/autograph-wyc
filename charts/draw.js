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
        svg.append('text')
          /** TechTip:selection.append(type):
           *  (d3-Modifying Elements)If the specified type is a string, appends a new element of this type (tag name) as the last child of each selected element,
           */
          .classed('chart-title',true)
          /** TechTip:selection.classed(names[,value]):
           * (d3-Modifying Elements)get,add or remove CSS classes
            If the value is truthy, then all elements are assigned the specified classes; otherwise, the classes are unassigned. 
           * 
           */
          .attr('y',22)
          /** TechTip:selection.attr(name[, value]) :
           * (d3-Modifying Elements)If a value is specified, sets the attribute with the specified name to the specified value on the selected elements and returns this selection
           ** SVG属性y:该属性在用户坐标系统中标识了一个y轴坐标。本坐标的确切效果依赖于每个元素。大多数时候，它体现了引用元素的矩形区域的左上角的y轴坐标。
           */
          .text(translate(data.title));
          /** TechTip: selection.text([value]):
           * (d3-Modifying Elements)If a value is specified, sets the text content to the specified value on all selected elements, replacing any existing child elements. 
           ** translate函数：来自translate模块，用于输出词汇表中英文的对应中文。
           */

          svg.append('text')
            .attr('class','chart-subtitle')
            .attr('y',42)
            .text(translate(data.subtitle));

          svg.append('text')
            .attr('class','chart-source')
            .attr('y',chartHeight - 5)//270-5=265
            .attr(`来源:${translate(data.source)}. ${convertTime(data.updated)}`);

        //MARK:line's container
          const container = svg.append('g') 
            /** TechTip:svg元素g
             * 元素g是用来组合对象的容器。添加到g元素上的变换会应用到其所有的子元素上。添加到g元素的属性会被其所有的子元素继承。此外，g元素也可以用来定义复杂的对象。
             */ 
            .attr('transform',`translate(${margin.left},${margin.top})`); //1,100
            /** TechTip:'transform'属性
             * 一种SVG Attribute。 The transform attribute defines a list of transform definitions that are applied to an element and the element's children. (transform属性定义一系列变换，应用于一个元素和其子元素)
             ** TechTip: translate(<x> [<y>])
             * transform属性定义的一种。 Specifies a translation by x and y.
             */
             
             const seriesKeys = _.map(data.y.series,'key');
             /** TechTip:_.map()
              * Lodash库的Collection函数。
              * Creates an array of values by running each element in collection thru iteratee.
              * 这里返回每个数组元素（这里为对象）的为属性'key'的值
              * 
              */

          // MARK: Caculate domain
            if (!data.xDomain) {
              data.xDomain = d3.extent(data.data,d => new Date(d[data.x.series]));
                /** TechTip:d3.extent(array[, accessor])
                 * (来自d3模块d3-array)
                 * Returns the minimum and maximum value in the given array using natural order.
                 * An optional accessor function may be specified, which is equivalent to calling array.map(accessor) before computing the extent.(可以指定一个可选的访问器函数accessor，意为在计算最大最小值之前调用array.map(accessor))
                 ** TechTip:new Date(..)
                 * 创建Date实例来处理日期和时间
                 */
            }

            if (!data.yDomain) {
              data.yDomain = [];
              data.yDomain[0] = d3.min(data.data,d => {
                 /** TechTip:d3.min(array[, accessor])
                 * (来自d3模块d3-array)
                 * Returns the minimum value in the given array using natural order.
                 * An optional accessor function may be specified, which is equivalent to calling array.map(accessor) before computing the extent.
                 */
                const values = seriesKeys.map(key => {
                  return Math.floor(Number(d[key]));
                });
                return d3.min(values);
              });

              data.yDomain[1] = d3.max(data.data,(d) => {
                const values = seriesKeys.map(key => {
                  return Math.ceil(Number(d[key]));//TechTip:Math.ceil()返回向上取整后的值
                });
                return d3.max(values);
              });
            }

            const xScale = d3.scaleTime()
              /** TechTip:d3.scaleTime()
              * （来自d3模块d3-scale)
              * Create a linear scale for time.
              */
              .domain(data.xDomain)
              /** TechTip:continuous.domain()
               * （来自d3模块d3-scale)
               * Set the input domain.
               */
              .range([0, plotWidth])
              /** TechTip:continuous.range()
               * （来自d3模块d3-scale)
               * Set the output range.
               */
              .nice();
              /** TechTip:continuous.nice()
               * （来自d3模块d3-scale)
               * Extend the domain to nice round numbers（整数值）.
               */

            const yScale = d3.scaleLinear()
              /** TechTip: d3.scaleLinear
               * （来自d3模块d3-scale)
               *  Create a quantitative linear scale.(定量线性范围)
               */
              .domain(data.yDomain)
              .range([plotHeight,0]);

        //add axis
            const xAxis = d3.axisBottom(xScale)
              /** TechTip:d3.axisBottom(scale)
               * （来自d3模块d3-axis)
               * Create a new bottom-oriented axis generator(底部的坐标轴生成器).
               */
              .ticks(5)
              /** TechTip:axis.ticks()
               * （来自d3模块d3-axis)
               * Customize how ticks(标记) are generated and formatted. The argument(5) is a suggested count for the number of ticks.
               */
              .tickSizeOuter(0);
              /** TechTip:axis.tickSizeOuter()
               * （来自d3模块d3-axis）
               * Set the size of outer (extent) ticks.
               */

            const yAxis = d3.axisRight(yScale)
              .ticks(4)
              .tickSize(-plotWidth)
              .tickSizeOuter(0);

            container.append('g')
              .attr('class','x axis')
              .attr('transform',`translate(0,${plotHeight})`)
              .call(xAxis);
              /** TechTip:selection.call()
               * 来自d3模块(d3-selection)
               * Call a function with this selection.
               */

           container.append('g')
              .attr('class', 'y axis')
              .attr('transform',`translate(${plotWidth},0)`)
              .call(yAxis)
              .call(g => {
                if (data.highlightvalue <= yScale.domain()[1] && data.highlightvalue >= yScale.domain()[0]) {
                  g.append('line')
                      .attr('class','highlignt-line')
                      .attr('x1',0)
                      .attr('y1',yScale(data.highlightvalue))
                      .attr('x2',-plotWidth)
                      .attr('y2',yScale(data.highlightvalue))
                }
              });

            //add legend

    });
  })
}