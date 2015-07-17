// Timer functions: MSK timezone

function startTime(offset) {
	offset = typeof offset !== 'undefined' ? offset : 3;
	var today=new Date();
	u = today.getTime() + (today.getTimezoneOffset() * 60000) + (60*60*1000*offset);
	today = new Date(u);
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('timer').innerHTML = h+":"+m+":"+s;
	var t = setTimeout(function(){startTime(offset)},500);
}

function checkTime(i) {
	if (i<10) {i = "0" + i};
	return i;
}

function Map(config) {
	var self = this;

	this.configure = function (config) {
		this.config = typeof config !== 'undefined' ? config : {};
		this.config.placeholder = typeof this.config.placeholder !== 'undefined' ? this.config.placeholder : 'body';
		this.config.width = typeof this.config.width !== 'undefined' ? this.config.width : window.innerWidth/2;
		this.config.height = typeof this.config.height !== 'undefined' ? this.config.height : window.innerHeight;
		this.config.map = typeof this.config.map !== 'undefined' ? this.config.map : 'static/msk.topojson';
	}

	this.render = function () {
		var that = this;
		var projection = d3.geo.mercator();
		var path = d3.geo.path().projection(projection);
		var plot = d3.select(that.config.placeholder).append("svg")
			.attr("width", that.config.width)
			.attr("height", that.config.height);

		var g = plot.append("g");

		plot.call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", function () {
				g.selectAll("path.width_oneandhalf").style("stroke-width", 1.5 / d3.event.scale + "px");
				g.selectAll("path.width_one").style("stroke-width", 1 / d3.event.scale + "px");
				g.select("path.rr_foreground").style("stroke-dasharray", [4 / d3.event.scale, 4 / d3.event.scale]);
				g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
			}))

		d3.json(that.config.map, function(error, map) {
		  if (error) return console.error(error);
			var boundaries = topojson.feature(map, map.objects.boundaries);

			projection.scale(1).translate([0, 0]);

			var b = path.bounds(boundaries),
				s = .95 / Math.max((b[1][0] - b[0][0]) / that.config.width, (b[1][1] - b[0][1]) / that.config.height),
				t = [(that.config.width - s * (b[1][0] + b[0][0])) / 2, (that.config.height - s * (b[1][1] + b[0][1])) / 2];

			projection.scale(s).translate(t);
			g.append("path").datum(boundaries).attr("d", path).classed("area", true);
			g.append("path").datum(topojson.mesh(map, map.objects.forest)).attr("d", path).classed("forest", true);
			g.append("path").datum(topojson.mesh(map, map.objects.sand)).attr("d", path).classed("sand", true);
			g.append("path").datum(topojson.mesh(map, map.objects.water)).attr("d", path).classed("water", true);
			g.append("path").datum(topojson.mesh(map, map.objects.houses)).attr("d", path).classed("houses", true);
			g.append("path").datum(topojson.mesh(map, map.objects.railroad)).attr("d", path).classed("rr_background", true).classed("width_oneandhalf", true);
			g.append("path").datum(topojson.mesh(map, map.objects.railroad)).attr("d", path).classed("rr_foreground", true).classed("width_one", true);
			g.append("path").datum(topojson.mesh(map, map.objects.road4)).attr("d", path).classed("road4", true).classed("width_one", true);
			g.append("path").datum(topojson.mesh(map, map.objects.road3)).attr("d", path).classed("road3", true).classed("width_one", true);
			g.append("path").datum(topojson.mesh(map, map.objects.road2)).attr("d", path).classed("road2", true).classed("width_oneandhalf", true);
			g.append("path").datum(topojson.mesh(map, map.objects.road1)).attr("d", path).classed("road1", true).classed("width_oneandhalf", true);
		});	
	}

	this.configure(config);
	/**/
}