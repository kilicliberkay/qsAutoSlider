define(["qlik"
],
	function (qlik) {

		function navigate(_direction){
			return _direction === "next" ? qlik.navigation.nextSheet() : qlik.navigation.prevSheet();
		}

		function countdown(_element,_value,_layout){

			Window.countdownInterval = setInterval(() => {
				_element.html(_value.toHHMMSS());

				if(!_value--){
					clearInterval(Window.countdownInterval);
					if (_layout.props.switch === true && qlik.navigation.getMode() !== qlik.navigation.EDIT) {	navigate(_layout.props.direction);	}
				}
				//_value-- || clearInterval(_interval);
			}, 1000);
		}

		Number.prototype.toSecond = function() {
			return this*1000;
		}

		Number.prototype.toHHMMSS = function () {
			var sec_num = parseInt(this, 10); // don't forget the second param
			var hours = Math.floor(sec_num / 3600);
			var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
			var seconds = sec_num - (hours * 3600) - (minutes * 60);

			if (hours < 10) { hours = "0" + hours; }
			if (minutes < 10) { minutes = "0" + minutes; }
			if (seconds < 10) { seconds = "0" + seconds; }
			return hours + ':' + minutes + ':' + seconds;
		}

		return {
			definition: {
				type: "items",
				component: "accordion",
				items: {
					appearance: {
						//uses: "settings",
						label: "Slider Options",
						items: {
							buttonGroupHeader: {
								type: "string",
								component: "buttongroup",
								label: "Direction",
								ref: "props.direction",
								options: [{
									value: "prev",
									label: "Previous"
								}, {
									value: "next",
									label: "Next"
								}],
								defaultValue: "next"
							},

							timerHeader: {
								ref: "props.timer",
								label: "Seconds",
								type: "integer",
								expression: "optional",
								min: 10, 
								defaultValue: 60
							},

							switchHeader: {
								type: "boolean",
								component: "switch",
								label: " ",
								ref: "props.switch",
								options: [{
									value: true,
									label: "On"
								}, {
									value: false,
									label: "Off"
								}],
								defaultValue: false
							}
						}
					}
				}
			},
			paint: function ($element, layout) {
				console.log(layout.props);
				clearInterval(Window.countdownInterval);	// have to clear interval on every resize
			
				countdown($element,layout.props.timer,layout);

				return qlik.Promise.resolve();
			}
		}

	});

