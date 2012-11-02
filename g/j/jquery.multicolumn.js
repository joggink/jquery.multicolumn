/**
 * jQuery Multicolumn
 * @Author: Jochen Vandendriessche <jochen@builtbyrobot.com>
 * @Author URI: http://builtbyrobot.com
 *
**/

(function($){
	"use strict";

	var methods = {
		init : function(config) {
			var options = $.extend({
				columnWidth: parseInt($(this).data('column-width').replace('px', '')),		// now we know the column width
				columnGutter: parseInt($(this).data('column-gap').replace('px', '')),		// get the column gap width
				columnNodes: [],															// only direct siblings will be used to position
				maxTop: $(this).height(),
				htmlMatrix: [],
				htmlRef: [],
				coords: {
					top: 0,
					left: 0
				}
			}, config);
			$(this).data('options', options);

			$(this).multicolumn('harvestNodes', $(this));
			$(this).multicolumn('calculateNodes');

			$(this).css('position', 'relative');

		},

		/*
			Get all the nodes in the element
		 */
		harvestNodes : function(htmlObj){
			var _r = [],
				n = 0,
				options = $(this).data('options');

			for (;n<$(htmlObj).children().length;n++){
				options.htmlRef.push($(htmlObj).children()[n]);
			}

		},

		calculateNodes : function(){
			var _col = 0,
				n = 0,
				options = $(this).data('options'),
				cspan = 1,
				o = null,
				hObj = null,
				tempCol = 0,
				_top = 0;


			function calculateTop(){
				if (options.htmlMatrix[_col]){
					if (options.htmlMatrix[_col][options.htmlMatrix[_col].length - 1].bottom > options.maxTop){
						_col += 1;
						return calculateTop();
					}else{
						return options.htmlMatrix[_col][options.htmlMatrix[_col].length - 1].bottom;
					}
				}else{
					return 0;
				}
			}

			function removeLine(n){
				while(n && n.nodeType != 3){
					n = n.firstChild;
				}
				if(!n) return;
			
				// get the height of the element
				var h = e.parentNode.offsetHeight;
				
				if(!h) {
					console.log('no height for: ' + e.tagName);
					return "";
				}
			
				// get the text as a string
				var str = n.nodeValue;
				
				// remove a word from the end of the string
				// until the height of the element changes 
				// (ie. a line has been removed)
				var wIdx= n.nodeValue.lastIndexOf(' ');
				while(wIdx!=-1 && e.offsetHeight == h) {			
					n.nodeValue = n.nodeValue.substr(0,	wIdx);
					wIdx = n.nodeValue.lastIndexOf(' ');
					if(wIdx==-1) wIdx = n.nodeValue.lastIndexOf('\n');
					//debug(e.offsetHeight + ' ' + h + ' text=' + n.nodeValue + ' wIdx= ' + wIdx);
				} 
				
				if(e.offsetHeight == h)
					n.nodeValue = "";
				// returns the removed text

				return str.substr(n.nodeValue.length);
			}

			for (;n<options.htmlRef.length;n++){
				o = $(options.htmlRef[n]);
				// calculate the position;
				cspan = parseInt(o.data('column-span'));
				cspan = (cspan <= 0) ? 1 : cspan;

				_top = calculateTop();

				console.log('Adding ' + o + ' with top ' + _top + ' and column ' + _col);

				// store it in the matrix
				hObj = {
					id: n,
					obj: o,
					top: _top,
					left: (_col * options.columnWidth) + (_col * options.columnGutter) + options.columnGutter,
					width: (cspan * options.columnWidth),
					span: cspan
				}

				o.css({
					position: 'absolute',
					top: hObj.top,
					left: hObj.left,
					width: hObj.width
				})

				hObj.bottom = _top + Math.ceil(o.outerHeight(true));

				if (hObj.bottom > options.maxTop){
					o.css({
						color: '#f00'
					})
					// fitText(o);
				}

				for (tempCol = 0;tempCol < cspan;tempCol++){
					if (!options.htmlMatrix[_col + tempCol]){
						options.htmlMatrix[_col + tempCol] = [];
					}
					options.htmlMatrix[_col + tempCol].push(hObj);
				}
			}

			$(this).css({
				width: ((_col + 1) * options.columnWidth) + ((_col + 1) * options.columnGutter) + options.columnGutter
			})
		}

	};

	$.fn.multicolumn = function(method){
		if ( methods[method] ) {
					return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
				} else if ( typeof method === 'object' || ! method ) {
					return methods.init.apply( this, arguments );
				} else {
					$.error( 'Method ' + method + ' does not exist on jQuery.multicolumn' );
		}
	};
})(this.jQuery);