var SNOWFLAKES = {
	options: {
		dimension: 300,
		spokesRangeMin: 6,
		spokesRangeMax: 20,
		branchesRangeMin: 1,
		branchesRangeMax: 2,
		branchConfig: null
	},
	draw: function(element) {
		var self = this;
		if(element.getContext) {
			var context = element.getContext('2d');
			element.width = self.options.dimension;
			element.height = self.options.dimension;
			var halfDimension = self.options.dimension / 2;
			context.translate(halfDimension, halfDimension);
			context.lineWidth = 1;
			context.lineCap = 'round';
			context.strokeStyle = "#FFFFFF";
			var spokesNum = self.randomEvenFromRange(self.options.spokesRangeMin, self.options.spokesRangeMax);
			var branchesNum = self.randomFromRange(self.options.branchesRangeMin, self.options.branchesRangeMax);
			for(var i = 0; i < spokesNum; i++) {
				self.drawLine(context, 0, halfDimension - 5, branchesNum);
				context.rotate(Math.PI / (spokesNum / 2));
			}
			console.log("Drawing snowflake: " + spokesNum + " spokes, " + branchesNum + " branches");

		}
	},
	drawLine: function(context, x, y, branchesNum) {
		var self = this;
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(x,y);
		context.stroke();
		context.moveTo(0,0);
		context.save();
		for(var i = 1; i <= branchesNum; i++) {
			self.drawBranch(context, x, y, branchesNum, i);
		}
		context.restore();
	},
	drawBranch: function(context, x, y, branchesNum, currentBranch) {
		var self = this;
		var halfDimension = self.options.dimension;
		var startPoint = (halfDimension / (branchesNum + 1)) * currentBranch;
		console.log(startPoint);
		context.moveTo(0, startPoint);
		context.save();
		context.rotate(- (Math.PI / 3));
		context.lineTo(0, 5);
		context.stroke();
		context.restore();
		context.save();
		context.rotate(Math.PI / 3);
		context.lineTo(0, 5);
		context.stroke();
		context.restore();
	},
	randomFromRange: function(min, max) {
		var self = this;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	randomEvenFromRange: function(min, max) {
		var self = this;
		return Math.ceil((Math.floor(Math.random() * (max - min + 1)) + min) / 2) * 2;
	}
}