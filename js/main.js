const body = document.body;

// Sets Current Resolution
const mobile = "mobile";
const tablet = "tablet";
const desktop = "desktop";
let currentReso = desktop;
const setCurrentReso = () => {
	const width = body.clientWidth;
	
	if (width < 768) {
		currentReso = mobile;
	} else if (width < 1024) {
		currentReso = tablet;
	} else {
		currentReso = desktop;
	}
}
setCurrentReso();

// Remove Set section heights of Scrollify in Mobile
const removeScrollifySectionHeightInMobile = () => {
	const sections = body.querySelectorAll(".section");
	for (let i = 0; i < sections.length; i++) {
		sections[i].style.height = "";
	}
}

$(function() {
	$.scrollify({
		section : ".section",
		updateHash: false
	});
});

if (currentReso == mobile) {
	$.scrollify.disable();
	$.scrollify.setOptions({setHeights: false});
	removeScrollifySectionHeightInMobile();
}

let widthToHeightRatio = 1.7;
if (currentReso == mobile) {
	widthToHeightRatio = 1.85;
}

const wrapperWorkLife = body.querySelector(".work-life-balance-graph-section > .wrapper");
const graph1CanvasContainer = wrapperWorkLife.querySelector(".canvas-container");
let graph1CanvasContainerWidth = graph1CanvasContainer.getBoundingClientRect().width;

const graph1PrevButton = graph1CanvasContainer.querySelector(".previous-button");
const graph1NextButton = graph1CanvasContainer.querySelector(".next-button");

const graphNamesUl = graph1CanvasContainer.querySelector(".graph1-names");
const graphNamesLis = graphNamesUl.querySelectorAll("li");

const graphNamesUlMobile = graph1CanvasContainer.querySelector(".graph1-names-mobile");
let graphNamesLisMobile = graphNamesUlMobile.querySelectorAll("li");

let cloneOfFirst = graphNamesLisMobile[0].cloneNode(true);
let cloneOfLast = graphNamesLisMobile[graphNamesLisMobile.length - 1].cloneNode(true);

graphNamesUlMobile.append(cloneOfFirst);
graphNamesUlMobile.prepend(cloneOfLast);

graphNamesLisMobile = graphNamesUlMobile.querySelectorAll("li");

let graph1Canvas;

// Setting up Scene, Camera & Renderer
const graph1Renderer = new THREE.WebGLRenderer({antialias: true});
graph1Renderer.setSize(graph1CanvasContainerWidth, graph1CanvasContainerWidth / widthToHeightRatio);
graph1CanvasContainer.insertBefore(graph1Renderer.domElement, graph1CanvasContainer.children[0]);
graph1Canvas = wrapperWorkLife.querySelector("canvas");

const graph1Raycaster2 = new THREE.Raycaster();
const graph1Touch = new THREE.Vector2();
graph1Touch.x = "";
let lastTouchLocation = {x: ""};
graph1Canvas.addEventListener("touchmove", (event) => {
	const canvasLeft = graph1Canvas.getBoundingClientRect().left + document.documentElement.scrollLeft;
	const canvasTop = graph1Canvas.getBoundingClientRect().top + document.documentElement.scrollTop;
	const touchObj = event.changedTouches[0];
	const x = touchObj.pageX - canvasLeft;
	const y = touchObj.pageY - canvasTop;

	if (graph1Touch.x) {
		lastTouchLocation.x = graph1Touch.x;
	}
	graph1Touch.x = (x / graph1Canvas.getBoundingClientRect().width) * 2 - 1;
	graph1Touch.y = -(y / graph1Canvas.getBoundingClientRect().height) * 2 + 1;
}, {passive: true});
graph1Canvas.addEventListener("touchend", () => {
	graph1Touch.x = "";
	graph1Touch.y = "";
}, {passive: true});

const graph1Scene = new THREE.Scene();
var graph1Camera = new THREE.PerspectiveCamera(45, graph1CanvasContainerWidth / (graph1CanvasContainerWidth / widthToHeightRatio), 1, 1000);

const graph1Holder = new THREE.Group();
graph1Scene.add(graph1Holder);

let graph1MovementX = 0,
	graph1CurrentMovementX = 1,
	graph1MouseXCanvas = 0,
	graph1Timer1,
	graph1Timer2,
	rotations = [-360, -180, -90, 90, 180, 360];

const graph1Raycaster = new THREE.Raycaster();
const graph1Mouse = new THREE.Vector2();

const graph1OnMouseMove = (event) => {
	graph1MovementX =  event.movementX;
	const rect = event.target.getBoundingClientRect();

	graph1MouseXCanvas = event.clientX - rect.left;
	const mouseYCanvas = event.clientY - rect.top;

	graph1Mouse.x = (graph1MouseXCanvas / rect.width) * 2 - 1;
	graph1Mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
}

graph1Canvas.addEventListener('mousemove', graph1OnMouseMove, false);

const options = {threshold: 0.3};

const handleIntersect = (entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			if (entry.target == interaction3Canvas) {
				calculateAndSetCurrentValues();
				for (var i = 0; i < interaction3Data.length; i++) {
					const ball = new Ball(interaction3Data[i].name, interaction3Data[i].value + "%", interaction3Data[i].color, interaction3Data[i].mass, interaction3Data[i].radius, interaction3Data[i].sMin, interaction3Data[i].sMax, i);
					interaction3Balls.push(ball);
					observer2.unobserve(entry.target);
				}
			} else if (entry.target == wrapperProjectByNumbers) {
				calculateBarsHeightAndAddThemInScene();
				camera.position.y = 0;
				camera.position.z = 40;
				barsInitialPosition = calculateBarsBotPosition(camera, canvas);
				for (let i = 0; i < bars.length; i++) {
					currentRotationSpeedAndDirectionOfBars[i] = [];
					rotationTl[i] = [];
					for (let j = 0; j < bars[i].length; j++) {
						currentRotationSpeedAndDirectionOfBars[i][j] = 0;
						rotationTl[i][j] = gsap.timeline();
					}
				}
				observer3.unobserve(entry.target);
			} else {
				graph1CalculateBarsHeightAndAddThemInScene();
				observer.unobserve(entry.target);
			}
		}
	});
}

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(graph1Canvas);

// const graph1AxesHelper = new THREE.AxesHelper(15);
// graph1Holder.add(graph1AxesHelper);

// const graph1Orbit = new THREE.OrbitControls(graph1Camera, graph1Renderer.domElement);

const graph1Light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
graph1Holder.add(graph1Light);

const graph1DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
graph1DirectionalLight.position.set(1, 0, 0);
graph1Scene.add(graph1DirectionalLight);

const workLifeGraphs = [
	[8, 8, 8, 10, 7],
	[8, 8, 8, 8, 8],
	[10, 10, 10, 10, 8],
	[9, 9, 9, 9, 8],
	[9, 8, 9, 9, 9],
	[9, 9, 9, 9, 10]
];
const graph1XValuesNames = ["communication", "quality", "timeliness", "partnership", "pricing"];
let graph1FirstTime = true;
let graph1CurrentGraph = 3;
let graph1CurrentGraphMobile = 3;
graphNamesUlMobile.scrollLeft = graphNamesLisMobile[graph1CurrentGraphMobile].offsetLeft;

let graph1Bars = [];
let graph1BarsHeight = [];
let graph1BarInitialPosition = {};

let graph1ValuesAppended = false;
let graph1XValuesAppended = false;

const wrapperProjectByNumbers = body.querySelector(".project-by-numbers-section > .wrapper");
const canvasContainer = wrapperProjectByNumbers.querySelector(".canvas-container");
let canvasContainerWidth = canvasContainer.getBoundingClientRect().width;

let canvas;

// Setting up Scene, Camera & Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(canvasContainerWidth, canvasContainerWidth / widthToHeightRatio);
renderer.setClearColor(0xffffff, 0);

canvasContainer.insertBefore(renderer.domElement, canvasContainer.children[0]);
canvas = wrapperProjectByNumbers.querySelector("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvasContainerWidth / (canvasContainerWidth / widthToHeightRatio) , 1, 1000);

const holder = new THREE.Group();
scene.add(holder);

let movementX = 0,
	currentMovementX = 1,
	mouseXCanvas = 0,
	timer1,
	timer2;

const graph2Raycaster2 = new THREE.Raycaster();
const graph2Touch = new THREE.Vector2();
graph2Touch.x = "";
let graph2LastTouchLocation = {x: ""};
canvas.addEventListener("touchmove", (event) => {
	const canvasLeft = canvas.getBoundingClientRect().left + document.documentElement.scrollLeft;
	const canvasTop = canvas.getBoundingClientRect().top + document.documentElement.scrollTop;
	const touchObj = event.changedTouches[0];
	const x = touchObj.pageX - canvasLeft;
	const y = touchObj.pageY - canvasTop;

	if (graph2Touch.x != "") {
		graph2LastTouchLocation.x = graph2Touch.x;
	}
	graph2Touch.x = (x / canvas.getBoundingClientRect().width) * 2 - 1;
	graph2Touch.y = -(y / canvas.getBoundingClientRect().height) * 2 + 1;
}, {passive: true});
canvas.addEventListener("touchend", () => {
	graph2Touch.x = "";
	graph2Touch.y = "";
}, {passive: true});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseMove = (event) => {
	movementX =  event.movementX;
	const rect = event.target.getBoundingClientRect();

	mouseXCanvas = event.clientX - rect.left;
	const mouseYCanvas = event.clientY - rect.top;

	mouse.x = (mouseXCanvas / rect.width) * 2 - 1;
	mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
}
	
canvas.addEventListener('mousemove', onMouseMove, false);

// const handleIntersect = (entries) => {
// 	entries.forEach(entry => {
// 		if (entry.isIntersecting) {
// 			observer.unobserve(entry.target);
// 		}
// 	});
// }

// const observer = new IntersectionObserver(handleIntersect, options);
// observer.observe(canvas);

// const axesHelper = new THREE.AxesHelper(15);
// holder.add(axesHelper);

// const orbit = new THREE.OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
holder.add(light);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 0, 0);
scene.add(directionalLight1);

const graphXNames = ["JavaScript", "HTML", "CSS", "jQuery", "React", "WordPress"];
const graphXValues = [41, 36, 36, 30, 22, 16];

let firstTime = true;

let bars = [];
let barsInitialPosition = {};

const enableOrDisablePrevAndNextButtons = (enable, prevButton, nextButton) => {
	if (enable) {
		prevButton.removeAttribute("disabled");
		nextButton.removeAttribute("disabled");
		prevButton.setAttribute("title", "Previous");
		nextButton.setAttribute("title", "Next");
	} else {
		prevButton.setAttribute("disabled", "");
		nextButton.setAttribute("disabled", "");
		prevButton.setAttribute("title", "Disabled");
		nextButton.setAttribute("title", "Disabled");
	}
}

let graph1BarWidth;
let barWidthInHTMLCordinates;
const calculateGraphBarWidth = (resize, bar, graphCamera, graphCanvas, graphNum) => {
	if (graphNum == 1) {
		if (graph1BarWidth && !resize) {
			return;
		}
	}
	if (graphNum == 2) {
		if (barWidthInHTMLCordinates && !resize) {
			return;
		}
	}
	if (!graph1BarWidth || !barWidthInHTMLCordinates || resize) {
		const boundingBox = new THREE.Box3().setFromObject(bar);
		const vector1 = new THREE.Vector3();
		const size = boundingBox.getSize(vector1);
		const width = size.x;

		const vector = new THREE.Vector3(bar.position.x - width/2, bar.position.y, bar.position.z);
		vector.project(graphCamera);
		vector.x = (vector.x + 1) * graphCanvas.getBoundingClientRect().width / 2;
		vector.y =  - (vector.y - 1) * graphCanvas.getBoundingClientRect().height / 2;
		const x = vector.x;
		const y = vector.y;
	
		const vector2 = new THREE.Vector3(bar.position.x + width/2, bar.position.y, bar.position.z);
		vector2.project(graphCamera);
		vector2.x = (vector2.x + 1) * graphCanvas.getBoundingClientRect().width / 2;
		const x2 = vector2.x;
		if (graphNum == 1) {
			graph1BarWidth = x2 - x;
		} else if (graphNum == 2) {
			barWidthInHTMLCordinates = x2 - x;
		}
	}
}

const calculateBarsBotPosition = (graphCamera, graphCanvas) => {
	graphCamera.updateMatrixWorld();
	const vector = graphCamera.position.clone();
	vector.applyMatrix4(graphCamera.matrixWorld);
	vector.project(graphCamera);
	vector.x = (vector.x + 1) * graphCanvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * (graphCanvas.getBoundingClientRect().width / widthToHeightRatio) / 2;
	const x = vector.x;
	const y = vector.y;
	return { x, y };
}

const graph1CalculateBarsHeightAndAddThemInScene = (prevGraphNum) => {
	// Bars
	const graph = workLifeGraphs[graph1CurrentGraph - 1];
	const barColors = [0x7fff00, 0x8a2be2, 0x8b0000, 0xffd700, 0x008080];
	const barMaxHeight = 15;
	let xPos = -16;
	let xDiff = 8;
	let widthDepth = 2.5;
	if (currentReso == mobile) {
		xPos = -22;
		xDiff = 11;
	}
	let maxValue = 10;

	if (graph1FirstTime) {
		for (let i = 0; i < graph.length; i++) {
			const geometryBar = new THREE.BoxGeometry(widthDepth, 0.1, widthDepth);
			geometryBar.translate(0, 0.1 / 2, 0);
			const materialBar = new THREE.MeshPhongMaterial({
				color: barColors[i],
				emissive: 0x000000,
				specular: 0x111111,
				shininess: 100,
				reflectivity: 1,
				refractionRatio: 0.98,
				combine: THREE.MultiplyOperation,
				side: THREE.DoubleSide
			});
			graph1Bars[i] = new THREE.Mesh(geometryBar, materialBar);
			graph1Bars[i].position.x = xPos;
			graph1Bars[i].rotation.y = Math.PI / 4;
			graph1Holder.add(graph1Bars[i]);
			xPos = xPos + xDiff;
			
			if (!graph1ValuesAppended) {
				if (i == (graph.length - 1)) {
					graph1ValuesAppended = true;
				}
				let timer = setTimeout(() => {
					clearTimeout(timer);
					if (i == 0) {
						calculateGraphBarWidth(false, graph1Bars[0], graph1Camera, graph1Canvas, 1);
					}
					appendOrUpdateValuesInGraph(i);
				}, 50);
			}
		}
		graph1FirstTime = false;
	} else {
		if (!graph1XValuesAppended) {
			graph1XValuesAppended = true;
			graph1AppendOrUpdateGraphXValues();
		}
		for (let i = 0; i < graph.length; i++) {
			const currentBarHeight = graph[i] / maxValue * barMaxHeight;
			graph1BarsHeight[i] = currentBarHeight;
			let newY;

			enableOrDisablePrevAndNextButtons(false, graph1PrevButton, graph1NextButton);
			if (prevGraphNum == undefined) {
				newY = graph1BarsHeight[i] / 0.1 * graph1Bars[i].scale.y;
				playCounterAnimation(".graph1-value-" + (i+1), workLifeGraphs[graph1CurrentGraph - 1][i], 2000);
				gsap.to(graph1Bars[i].scale, {
					y: newY, 
					duration: 2, 
					ease: "power2.out", 
					onUpdate: () => {
						updatePositionOfGraphValues(i);
					},
					onComplete: () => {
						enableOrDisablePrevAndNextButtons(true, graph1PrevButton, graph1NextButton);
					}
				});
			} else {
				appendOrUpdateValuesInGraph(i);
				const prevGraphArr = workLifeGraphs[prevGraphNum - 1];
				newY = graph[i] / prevGraphArr[i] * graph1Bars[i].scale.y;
				playCounterAnimation(".graph1-value-" + (i+1), workLifeGraphs[graph1CurrentGraph - 1][i], 1600);
				gsap.to(graph1Bars[i].scale, {
					y: newY, 
					duration: 1.6, 
					ease: "power2.out", 
					onUpdate: () => {
						updatePositionOfGraphValues(i);
					},
					onComplete: () => {
						enableOrDisablePrevAndNextButtons(true, graph1PrevButton, graph1NextButton);
					}
				});
			}
		}
	}
}

// Change Graph name on Mobile reso
const changeGraphNameWithSlideAnimationForMobile = (currentSlideNum, lis, ul, slider) => {
	const currentGraph = lis[currentSlideNum];
	ul.scroll({
		left: currentGraph.offsetLeft,
		behavior: "smooth"
	});
	const timer = setTimeout(() => {
		clearTimeout(timer);
		if (currentSlideNum == (lis.length - 1)) {
			ul.scroll({left: lis[1].offsetLeft});
			if (slider == 1) {
				graph1CurrentGraphMobile = 1;
			} else if (slider == 2) {
				interaction3CurrentSlideMobile = 1;
			}
			
		} else if (currentSlideNum == 0) {
			ul.scroll({left: lis[lis.length - 2].offsetLeft});
			if (slider == 1) {
				graph1CurrentGraphMobile = workLifeGraphs.length;
			} else if (slider == 2) {
				interaction3CurrentSlideMobile = workLifeGraphs.length;
			}
		}
		if (slider == 1) {
			if (!lis[graph1CurrentGraphMobile].classList.contains("active")) {
				lis[graph1CurrentGraphMobile].classList.add("active");
			}
		} else if (slider == 2) {
			if (!lis[interaction3CurrentSlideMobile].classList.contains("active")) {
				lis[interaction3CurrentSlideMobile].classList.add("active");
			}
		}
	}, 500);
}

// Changes graph name with animation when next or previous button is clicked
const changeGraphNameWithSlideAnimation = (prevSlideNum, currentSlideNum, prevOrNext, lis, ul) => {
	const prevGraph = lis[prevSlideNum - 1];
	const currentGraph = lis[currentSlideNum - 1];

	prevGraph.classList.remove("active");
	currentGraph.classList.add("active");

	if (prevOrNext == 1) {
		ul.scroll({
			left: prevGraph.getBoundingClientRect().left,
			behavior: "smooth"
		});
		const timer = setTimeout(() => {
			clearTimeout(timer);
			ul.append(ul.children[0]);
			ul.scroll({left: 0});
		}, 500);
	} else {
		ul.insertBefore(ul.children[lis.length - 1], ul.children[0]);
		ul.scroll({
			left: lis[1].getBoundingClientRect().left
		});
		ul.scroll({
			left: 0,
			behavior: "smooth"
		});
	}
}

const prevOrNextButtonClick = (prevOrNext) => {
	graph1ValuesAppended = false;
	let prevGraph;
	if (currentReso == mobile) {
		prevGraph = graph1CurrentGraphMobile;
	} else {
		prevGraph = graph1CurrentGraph;
	}
	graphNamesLisMobile[prevGraph].classList.remove("active");

	if (prevGraph == workLifeGraphs.length && prevOrNext == 1) {
		graph1CurrentGraphMobile = workLifeGraphs.length + 1;
		graph1CurrentGraph = 1;
	} else if (graph1CurrentGraph == 1 && prevOrNext == -1) {
		graph1CurrentGraphMobile = 0;
		graph1CurrentGraph = workLifeGraphs.length;
	} else {
		graph1CurrentGraphMobile += prevOrNext;
		graph1CurrentGraph += prevOrNext;
	}
	changeGraphNameWithSlideAnimationForMobile(graph1CurrentGraphMobile, graphNamesLisMobile, graphNamesUlMobile , 1);
	changeGraphNameWithSlideAnimation(prevGraph, graph1CurrentGraph, prevOrNext, graphNamesLis, graphNamesUl);
	graph1CalculateBarsHeightAndAddThemInScene(prevGraph);
}

graph1PrevButton.addEventListener("click", prevOrNextButtonClick.bind(this, -1));
graph1NextButton.addEventListener("click", prevOrNextButtonClick.bind(this, 1));

graph1CalculateBarsHeightAndAddThemInScene();

graph1Camera.position.y = 0;
graph1Camera.position.z = 40;
graph1BarInitialPosition = calculateBarsBotPosition(graph1Camera, graph1Canvas);
// graph1Orbit.update();

let graph1RotationTl = [], graph1CurrentRotationSpeedAndDirectionOfBars = [];
for (let i = 0; i < graph1Bars.length; i++) {
	graph1CurrentRotationSpeedAndDirectionOfBars[i] = 0;
	graph1RotationTl[i] = gsap.timeline();
}

const graph1RotateBar = (cube, currentBarTL, currentBarRotation) => {
	if (!currentBarTL.isActive() && graph1MovementX != graph1CurrentMovementX) {
		graph1CurrentMovementX = graph1MovementX;
		if (graph1CurrentMovementX < -25) {
			currentBarRotation = rotations[0];
			// rotate bar -(360 + 30) degrees ie. -390 degrees
			currentBarTL.to(cube.rotation, {y: "-=6.806784083", ease: "none", duration: 1})
			// rotate back the extra 30 degrees added previously for getting the effect on site
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (graph1CurrentMovementX < -15) {
			currentBarRotation = rotations[1];
			// rotate bar -(180 + 30) degrees ie. -210 degrees
			currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (graph1CurrentMovementX < 0) {
			if (currentBarRotation == rotations[2]) {
				if (!graph1Timer1) {
					graph1Timer1 = setTimeout(() => {
						clearTimeout(graph1Timer1);
						// rotate bar -(90 + 30) degrees ie. -120 degrees
						currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[2];
				currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (graph1CurrentMovementX == 0) {
			currentBarTL.clear();
		} else if (graph1CurrentMovementX <= 15) {
			if (currentBarRotation == rotations[3]) {
				if (!graph1Timer2) {
					graph1Timer2 = setTimeout(() => {
						clearTimeout(graph1Timer2);
						currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[3];
				currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (graph1CurrentMovementX <= 25) {
			currentBarRotation = rotations[4];
			currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		} else {
			currentBarRotation = rotations[5];
			currentBarTL.to(cube.rotation, {y: "+=6.806784083", ease: "none", duration: 1})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		}
	}
}

const graphRotateBarOnSwipe = (cube, currentBarTL, currentBarRotation, currentLoc, lastLoc) => {
	if (!currentBarTL.isActive()) {
		if (lastLoc.x && currentBarRotation == 0) {
			if (currentLoc.x < lastLoc.x) {
				currentBarRotation = rotations[1];
				// rotate bar -(180 + 30) degrees ie. -210 degrees
				currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5, onComplete: () => {
						currentBarRotation = 0;
					}});
			} else if (currentLoc.x > lastLoc.x) {
				currentBarRotation = rotations[4];
				currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5, onComplete: () => {
						currentBarRotation = 0;
					}});
			}
		}
	}
}

const scale = (number, inMin, inMax, outMin, outMax) => {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

let graph1CanvasDistanceFromTop;
let graph1CanvasVisibleMin;
let graph1CanvasHeight;
let graph1CurrentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const setRotationAngleOfBarsBasedOnScrollPosition = () => {
	graph1CanvasDistanceFromTop = document.documentElement.scrollTop + graph1Canvas.getBoundingClientRect().top;
	graph1CanvasVisibleMin = graph1CanvasDistanceFromTop - window.innerHeight;
	graph1CanvasHeight = graph1Canvas.getBoundingClientRect().width / widthToHeightRatio;

	let windowY;
	if (graph1CurrentWindowY != undefined) {
		windowY = graph1CurrentWindowY;
	} else {
		windowY = undefined;
	}
	graph1CurrentWindowY = window.scrollY - graph1CanvasVisibleMin;

	if (graph1CurrentWindowY != windowY && windowY != undefined) {
		if (graph1CurrentWindowY >= 0 && graph1CurrentWindowY <= graph1CanvasHeight) {
			const percent = Math.round(graph1CurrentWindowY / graph1CanvasHeight * 100);
			if (percent >= 25 && percent <= 90) {
				graph1Camera.position.y = scale(percent, 25, 90, 18, -6);
				graph1Camera.setViewOffset(graph1Canvas.getBoundingClientRect().width, graph1CanvasHeight, 0, 0, graph1Canvas.getBoundingClientRect().width, graph1CanvasHeight);
				graph1Camera.setViewOffset(graph1Canvas.getBoundingClientRect().width, graph1CanvasHeight, 0, calculateBarsBotPosition(graph1Camera, graph1Canvas).y - graph1BarInitialPosition.y, graph1Canvas.getBoundingClientRect().width, graph1CanvasHeight);
			}
		}
	}
}

// For tilting graph based on left-right position of mouse cursor
const tiltGraphBasedOnMouseXPosition = (canvas, mouseXCanvas, holder) => {
	const percent = Math.round(mouseXCanvas / canvas.getBoundingClientRect().width * 100);
	// Tilts graph by 4 degrees both directions based on mouse x position
	const newY = scale(percent, 0, 100, 0.06981317, -0.06981317);
	if (holder.rotation.y != newY) {
		holder.rotation.y = newY;
	}
}

// Starts counter increment/decrement animation from previous to new value
const playCounterAnimation = (spanClassName, counterMaxValue, counterDuration) => {
	const span = graph1CanvasContainer.querySelector(spanClassName);
	let counterMinValue = 0;
	if (span.getAttribute("data-counter-value")) {
		counterMinValue = parseFloat(span.getAttribute("data-counter-value"));
	}

	const timerInterval = 40;
	const step = counterDuration / timerInterval;

	let counterIncrement;
	let counterValue = counterMinValue;

	counterIncrement = parseFloat((counterMaxValue - counterMinValue) / step);

	let i = 1; 
	const interval = setInterval(() => {
		if (i <= step) {
			counterValue += counterIncrement;
			span.innerText = Math.round(counterValue * 100) / 100;
			++i;
		} else {
			span.setAttribute("data-counter-value", counterMaxValue);
			clearInterval(interval);
		}
	}, timerInterval);
}

// Calculates & returns html coordinates of a given bar of graph
function graph1CalculateCoordinatesOfBarInCanvas(i, yPos) {
	const boundingBox = new THREE.Box3().setFromObject(graph1Bars[i]);
	const vector1 = new THREE.Vector3();
	const size = boundingBox.getSize(vector1);
	const width = size.x;

	const vector = new THREE.Vector3(graph1Bars[i].position.x - width/2, yPos, graph1Bars[i].position.z);
	vector.project(graph1Camera);
	vector.x = (vector.x + 1) * graph1Canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * graph1Canvas.getBoundingClientRect().height / 2;
	const x = vector.x;
	const y = vector.y;
	
	return {x, y};
}

// appends the graph values (Written as Normal function as it needs to get hoisted)
function appendOrUpdateValuesInGraph(i) {
	const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y + 0.1);

	let span = graph1CanvasContainer.querySelector(".graph1-value-" + (i+1));
	if (!span) {
		span = document.createElement("span");
	}
	
	if (!graph1CanvasContainer.querySelector(".graph1-value-" + (i+1))) {
		span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i];
		span.classList.add("graph1-value");
		span.classList.add("graph1-value-" + (i+1));
		span.style.top = obj.y + "px";
		span.style.left = obj.x + "px";
		graph1CanvasContainer.append(span);

		const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
		if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}

		span.innerText = 0;
	} else {
		let prevValue;
		if (span.getAttribute("data-counter-value")) {
			prevValue = span.getAttribute("data-counter-value");
			span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i];
			span.style.left = obj.x + "px";
			const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
			if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
				span.style.left = (span.offsetLeft - xDiffBy2) + "px";
			}
			span.innerText = prevValue;
		}
	}
}

// Updates y-position of appended percent graph values when bar size changes
const updatePositionOfGraphValues = (i, updateBothPositions = false) => {
	let span = graph1CanvasContainer.querySelector(".graph1-value-" + (i+1));
	if (!span) {
		return;
	}

	const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y + graph1Bars[i].scale.y * 0.1);

	span.style.top = obj.y + "px";
	if (updateBothPositions) {
		span.style.left = obj.x + "px";
		const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
		if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}
	}
}

// Appends or updates names of x-axis of graph
function graph1AppendOrUpdateGraphXValues(update = false) {
	for (let i = 0; i < graph1XValuesNames.length; i++) {
		const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y);
		let span;

		if (update) {
			span = graph1CanvasContainer.querySelectorAll(".graph1-x-name")[i];
			if (!span) {
				return;
			}
			span.style.left = obj.x + "px";
			span.style.top = obj.y + "px";
		} else {
			span = document.createElement("span");
			span.classList.add("graph1-x-name");
			span.innerText = graph1XValuesNames[i];
			span.style.left = obj.x + "px";
			span.style.top = obj.y + "px";
			graph1CanvasContainer.append(span);
		}

		if (!isNaN(graph1BarWidth) && graph1BarWidth != Infinity && graph1BarWidth != -Infinity) {
			const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}
	}
}

const options3 = {threshold: 0.01};
const observer3 = new IntersectionObserver(handleIntersect, options3);
observer3.observe(wrapperProjectByNumbers);

const calculateBarsHeightAndAddThemInScene = () => {
	// Bars
	const barColor = 0xe31c79;
	const topAndBotFaceColor = 0xf39ec6;
	const barMaxHeight = 15;
	const maxBars = 5;
	let xPos = -17.5;
	let widthDepth = 2.5;
	let xDiff = 7;
	if (currentReso == mobile) {
		xPos = -22.5;
		xDiff = 9;
	}
	let maxValue = graphXValues[0];
	let individualBarHeight;
	let numOfBars = [];

	for (let i = 1; i < graphXValues.length; i++) {
		if (graphXValues[i] > maxValue) {
			maxValue = graphXValues[i];
		}
	}

	for (let i = 0; i < graphXValues.length; i++) {
		numOfBars[i] = Math.round(graphXValues[i] / maxValue * maxBars);
	}

	individualBarHeight = barMaxHeight / maxBars;

	for (let i = 0; i < graphXNames.length; i++) {
		bars[i] = [];
		for (let j = 0; j < numOfBars[i]; j++) {
			const geometryBar = new THREE.BoxGeometry(widthDepth, individualBarHeight, widthDepth).toNonIndexed();
			geometryBar.translate(0, individualBarHeight / 2, 0);
			const materialBar = new THREE.MeshPhongMaterial({
				emissive: 0x000000,
				specular: 0x111111,
				shininess: 100,
				reflectivity: 1,
				refractionRatio: 0.98,
				combine: THREE.MultiplyOperation,
				side: THREE.DoubleSide,
				vertexColors: true
			});
			const positionAttribute = geometryBar.getAttribute('position');
			const color = new THREE.Color();
			geometryBar.setAttribute('color', new THREE.BufferAttribute(new Float32Array(positionAttribute.count * 3), 3));
			const vertexColor = geometryBar.getAttribute('color');

			const botFace = {min: 18, max: 24};
			const topFace = {min: 12, max: 18};
			for (let k = 0; k < positionAttribute.count; k++) {
				if ((k >= botFace.min && k < botFace.max) || (k >= topFace.min && k < topFace.max)) {
					color.setHex(topAndBotFaceColor);
				} else {
					color.setHex(barColor);
				}
				vertexColor.setXYZ(k, color.r, color.g, color.b);
			}

			bars[i][j] = new THREE.Mesh(geometryBar, materialBar);
			bars[i][j].position.x = xPos;
			
			if (j == 0 ) {
				bars[i][j].position.y = 0;
			} else {
				bars[i][j].position.y = (individualBarHeight + 0.1) * j;
			}

			bars[i][j].rotation.y = Math.PI / 4;
			holder.add(bars[i][j]);

			if (i == (graphXNames.length - 1) && j == (numOfBars[i] - 1)) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					calculateGraphBarWidth(false, bars[0][0], camera, canvas, 2);
					appendGraphXValues();
				}, 400);
			}
		}
		xPos = xPos + xDiff;
	}
}

// orbit.update();
let rotationTl = [], currentRotationSpeedAndDirectionOfBars = [];

const rotateBar = (cube, currentBarTL, currentBarRotation) => {
	if (!currentBarTL.isActive() && movementX != currentMovementX) {
		currentMovementX = movementX;
		if (currentMovementX < -25) {
			currentBarRotation = rotations[0];
			// rotate bar -(360 + 30) degrees ie. -390 degrees
			currentBarTL.to(cube.rotation, {y: "-=6.806784083", ease: "none", duration: 1})
			// rotate back the extra 30 degrees added previously for getting the effect on site
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < -15) {
			currentBarRotation = rotations[1];
			// rotate bar -(180 + 30) degrees ie. -210 degrees
			currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < 0) {
			if (currentBarRotation == rotations[2]) {
				if (!timer1) {
					timer1 = setTimeout(() => {
						clearTimeout(timer1);
						// rotate bar -(90 + 30) degrees ie. -120 degrees
						currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[2];
				currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX == 0) {
			currentBarTL.clear();
		} else if (currentMovementX <= 15) {
			if (currentBarRotation == rotations[3]) {
				if (!timer2) {
					timer2 = setTimeout(() => {
						clearTimeout(timer2);
						currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[3];
				currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX <= 25) {
			currentBarRotation = rotations[4];
			currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		} else {
			currentBarRotation = rotations[5];
			currentBarTL.to(cube.rotation, {y: "+=6.806784083", ease: "none", duration: 1})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		}
	}
}

let canvasDistanceFromTop;
let canvasVisibleMin;
let canvasHeight;
let currentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const graph2SetRotationAngleOfBarsBasedOnScrollPosition = () => {
	canvasDistanceFromTop = document.documentElement.scrollTop + canvas.getBoundingClientRect().top;
	canvasVisibleMin = canvasDistanceFromTop - window.innerHeight;
	canvasHeight = canvas.getBoundingClientRect().width / widthToHeightRatio;
	let windowY;
	if (currentWindowY != undefined) {
		windowY = currentWindowY;
	} else {
		windowY = undefined;
	}
	currentWindowY = window.scrollY - canvasVisibleMin;

	if (currentWindowY != windowY && windowY != undefined) {
		if (currentWindowY >= 0 && currentWindowY <= canvasHeight) {
			const percent = Math.round(currentWindowY / canvasHeight * 100);
			if (percent >= 25 && percent <= 90) {
				camera.position.y = scale(percent, 25, 90, 15, -6);
				camera.setViewOffset(canvas.getBoundingClientRect().width, canvasHeight, 0, 0, canvas.getBoundingClientRect().width, canvasHeight);
				camera.setViewOffset(canvas.getBoundingClientRect().width, canvasHeight, 0, calculateBarsBotPosition(camera, canvas).y - barsInitialPosition.y, canvas.getBoundingClientRect().width, canvasHeight);
			}
		}
	}
}

// Calculates & returns html coordinates of a given bar of graph
function calculateCoordinatesOfBarInCanvas(i, yPos) {
	const boundingBox = new THREE.Box3().setFromObject(bars[i][0]);
	const vector1 = new THREE.Vector3();
	const size = boundingBox.getSize(vector1);
	const width = size.x;

	const vector = new THREE.Vector3(bars[i][0].position.x - width/2, yPos, bars[i][0].position.z);
	vector.project(camera);
	vector.x = (vector.x + 1) * canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * canvas.getBoundingClientRect().height / 2;

	const x = vector.x;
	const y = vector.y;

	return {x, y};
}

// Appends values of x-axis of the graph at proper position
const appendGraphXValues = (update) => {
	for (let i = 0; i < graphXNames.length; i++) {
		const obj = calculateCoordinatesOfBarInCanvas(i, bars[i][0].position.y);

		let div;
		if (update) {
			div = canvasContainer.querySelectorAll(".graph2-x")[i];
			if (!div) {
				return;
			}
			div.style.left = obj.x + "px";
			div.style.top = obj.y + "px";
		} else {
			div = document.createElement("div");
			div.classList.add("graph2-x");
			div.style.left = obj.x + "px";
			div.style.top = obj.y + "px";

			const span1 = document.createElement("span");
			span1.classList.add("graph-x-name");
			span1.innerText = graphXNames[i];
			div.append(span1);

			const span2 = document.createElement("span");
			span2.classList.add("graph-x-value");
			span2.innerText = graphXValues[i];
			div.append(span2);

			canvasContainer.append(div);
		}

		const xDiffBy2 = (div.getBoundingClientRect().width - barWidthInHTMLCordinates) / 2;
		div.style.left = (div.offsetLeft - xDiffBy2) + "px";
	}
}

/* Interaction 3 start */
const interaction3CanvasContainer = body.querySelector(".spheres-section .canvas-container");
let interaction3CanvasContainerWidth = interaction3CanvasContainer.getBoundingClientRect().width;
const interaction3PrevButton = interaction3CanvasContainer.querySelector(".previous-button");
const interaction3NextButton = interaction3CanvasContainer.querySelector(".next-button");
const interaction3NamesUl = interaction3CanvasContainer.querySelector(".interaction3-names");
const interaction3NamesLis = interaction3NamesUl.querySelectorAll("li");
const interaction3NamesUlMobile = interaction3CanvasContainer.querySelector(".interaction3-names-mobile");
let interaction3NamesLisMobile = interaction3NamesUlMobile.querySelectorAll("li");
cloneOfFirst = interaction3NamesLisMobile[0].cloneNode(true);
cloneOfLast = interaction3NamesLisMobile[interaction3NamesLisMobile.length - 1].cloneNode(true);
interaction3NamesUlMobile.append(cloneOfFirst);
interaction3NamesUlMobile.prepend(cloneOfLast);
interaction3NamesLisMobile = interaction3NamesUlMobile.querySelectorAll("li");

// Sets data for the Bubbles/Spheres of current slide and for current resolution
const calculateAndSetCurrentValues = (notFirstTime) => {
	const currentValues = interaction3Values[interaction3CurrentSlide - 1];
	let radiusMin = 0.7;
	let radiusMax = 1;
	if (currentReso == tablet) {
		radiusMin = 0.55;
		radiusMax = 0.85;
	} else if (currentReso == mobile) {
		radiusMin = 0.4;
		radiusMax = 0.6;
	}

	for (let i = 0; i < currentValues.length; i++) {
		interaction3Mass[i] = scale(currentValues[i], 0, 24.9, 0.0005, 0.0025);
		interaction3Radius[i] = scale(currentValues[i], 0, 24.9, radiusMin, radiusMax);
		interaction3SpeedMaxNeg[i] = scale(currentValues[i], 0, 24.9, -1/8, -1);
		interaction3SpeedMax[i] = scale(currentValues[i], 0, 24.9, 1/8, 1);

		interaction3Data[i] = {};
		interaction3Data[i].name = interaction3Names[interaction3CurrentSlide-1][i];
		interaction3Data[i].value = interaction3Values[interaction3CurrentSlide-1][i];
		interaction3Data[i].mass = interaction3Mass[i];
		interaction3Data[i].radius = interaction3Radius[i];
		interaction3Data[i].sMin = interaction3SpeedMaxNeg[i];
		interaction3Data[i].sMax = interaction3SpeedMax[i];
		interaction3Data[i].color = interaction3Colors[interaction3CurrentSlide-1];

		if (notFirstTime) {
			interaction3Balls[i].updateValues(i);
		}
	}
}

// Updates values of Bubbles when window resized from one device range to another
const updateRadiusOnResize = (reso) => {
	if (interaction3Balls.length == 0) {
		return;
	}
	let radiusMin = 0.7;
	let radiusMax = 1;
	if (reso == tablet) {
		radiusMin = 0.55;
		radiusMax = 0.85;
	} else if (reso == mobile) {
		radiusMin = 0.4;
		radiusMax = 0.6;
	}
	const currentValues = interaction3Values[interaction3CurrentSlide - 1];
	for (let i = 0; i < currentValues.length; i++) {
		interaction3Radius[i] = scale(currentValues[i], 0, 24.9, radiusMin, radiusMax);
		interaction3Data[i].radius = interaction3Radius[i];
		interaction3Balls[i].updateOnResize(i, reso);
	}
}

const interaction3Values = [
	[2.8, 12.8, 15.7, 3, 20.6, 3.7, 24.9, 4.5, 1.9],
	[1.3, 3.5, 5.7, 1.4, 7.9, 1.7, 2, 12.6, 1.3],
	[5.6, 3.2, 3.6, 5.9, 4.2, 3, 8.8, 9, 4.9],
	[9.1, 2.1, 9.6, 2.2, 2.2, 9.9, 2.1, 14.4, 4],
	[6.1, 2.7, 3.3, 6.6, 3.7, 9.1, 1.6, 9.5, 4.4],
	[2.5, 5.2, 9.1, 2.6, 2.9, 10.5, 2.5, 14, 3.8]
];
const interaction3Names = [
	["NATIVE", "KANBAN", "MOBILE", "SAAS", "SCRUM", "MANAGEMENT", "AGILE", "WATERFALL", "APPS"],
	["EDITING", "CONTENT", "SOCIAL MEDIA", "EMAIL", "COPYWRITING", "LANDING PAGES", "ADVERTISING", "BLOGGING", "MARKETING"],
	["FACEBOOK", "EMAIL", "STRATEGY", "CONTENT", "ADWORDS", "ADS", "GROWTH", 'SOCIAL MEDIA', "PRODUCT"],
	["CONTENT CREATION", "DESIGN", "TWITTER", "PINTEREST", "VIDEO", "FACEBOOK", "MANAGEMENT", "INSTAGRAM", "LINKEDIN"],
	["BRANDING", "PRINT", "GRAPHIC DESIGN", "WEB", "MOBILE", "UI", "ILLUSTRATION", "UX", "PRODUCT"],
	["JAVA", "ANGULARJS", "NODE", "VUE", "TYPESCRIPT", "JAVASCRIPT", "LARAVEL", "REACT", "PYTHON"]
];
const interaction3Colors = [0xff2c55, 0x006400, 0xff4500, 0xff00ff, 0x00ffff, 0x7fff00];
let interaction3Mass = [];
let interaction3Radius = [];
let interaction3SpeedMaxNeg = [];
let interaction3SpeedMax = [];
let interaction3CurrentSlide = 3;
let interaction3CurrentSlideMobile = 3;
interaction3NamesUlMobile.scrollLeft = interaction3NamesLisMobile[interaction3CurrentSlideMobile].offsetLeft;
let interaction3Data = [];
const interaction3Zoom = 100;
let interaction3Balls = [];
const interaction3MobileHeight = 700;
const interaction3TabletHeight = 850;
const interaction3DesktopHeight = 1050;

let interaction3Height = interaction3DesktopHeight;
if (currentReso == mobile) {
	interaction3Height = interaction3MobileHeight;
} else if (currentReso == tablet) {
	interaction3Height = interaction3TabletHeight;
}
const interaction3Renderer = PIXI.autoDetectRenderer(interaction3CanvasContainerWidth, interaction3Height, {
  transparent: true, antialias: true
});
interaction3CanvasContainer.appendChild(interaction3Renderer.view);

const interaction3PrevOrNextClick = (prevOrNext) => {
	let prevGraph;
	if (currentReso == mobile) {
		prevGraph = interaction3CurrentSlideMobile;
	} else {
		prevGraph = interaction3CurrentSlide;
	}
	interaction3NamesLisMobile[prevGraph].classList.remove("active");
	if (interaction3CurrentSlide == interaction3Names.length && prevOrNext == 1) {
		interaction3CurrentSlideMobile = interaction3Names.length + 1;
		interaction3CurrentSlide = 1;
	} else if (interaction3CurrentSlide == 1 && prevOrNext == -1) {
		interaction3CurrentSlideMobile = 0;
		interaction3CurrentSlide = interaction3Names.length;
	} else {
		interaction3CurrentSlideMobile += prevOrNext;
		interaction3CurrentSlide += prevOrNext;
	}
	changeGraphNameWithSlideAnimationForMobile(interaction3CurrentSlideMobile, interaction3NamesLisMobile, interaction3NamesUlMobile, 2);
	changeGraphNameWithSlideAnimation(prevGraph, interaction3CurrentSlide, prevOrNext, interaction3NamesLis, interaction3NamesUl);
	calculateAndSetCurrentValues(true);
}

interaction3PrevButton.addEventListener("click", interaction3PrevOrNextClick.bind(this, -1));
interaction3NextButton.addEventListener("click", interaction3PrevOrNextClick.bind(this, 1));

let interaction3Movement = {};
const interaction3OnMousemove = (event) => {
	if (event.movementX != undefined && event.movementY != undefined) {
		interaction3Movement.x = event.movementX;
  	interaction3Movement.y = event.movementY;
	}
}

const interaction3Canvas = interaction3CanvasContainer.querySelector("canvas");
interaction3Canvas.addEventListener("mousemove", interaction3OnMousemove, false);

const interaction3World = new p2.World({gravity: [1, 1]});
const interaction3Stage = new PIXI.Container();
interaction3Stage.position.x = interaction3Renderer.width / 2; // center at origin
interaction3Stage.position.y = interaction3Height / 2;
interaction3Stage.scale.x = interaction3Zoom; // zoom in
interaction3Stage.scale.y = -interaction3Zoom; // Note: we flip the y axis to make "up" the physics "up"

//floor
const planeShape = new p2.Plane();
const planeBody = new p2.Body({position:[0, -1]});
planeBody.addShape(planeShape);
interaction3World.addBody(planeBody);

const Ball = function (t, v, c, m, r, sMin, sMax, x) {
  this.init = function () {
    this.el = new PIXI.Container();
    this.radius = r;
		this.sMin = sMin;
		this.sMax = sMax;

    this.circle = new PIXI.Graphics();
    this.circle.beginFill(c);
    this.circle.drawCircle(0, 0, 0.99);
    this.circle.endFill();
    this.circle.interactive = true;
    this.circle.hitArea = new PIXI.Circle(0, 0, 1);
    this.circle.scale.x = this.circle.scale.y = this.radius;

		this.bubble = new PIXI.Sprite.from('images/bubble3.webp');
		this.bubble.anchor.set(0.5, 0.5);
		this.bubble.width = 2.3 * r;
		this.bubble.height = 2.3 * r;
		this.bubble.hitArea = new PIXI.Circle(0, 0, 1);
		this.bubble.mask = this.circle;
		this.el.addChild(this.bubble);
		this.el.addChild(this.circle);
    interaction3Stage.addChild(this.el);

		this.text = new PIXI.Text(v, {
      fontFamily: 'Poppins Regular',
      fontSize: 40,
			fontWeight: "bold",
      fill: 0x000,
      wordWrap: true
    });
    this.text.anchor.x = 0.5;
    this.text.anchor.y = 0.7;
    this.text.position.x = 0;
    this.text.scale.x = 0.01;
    this.text.scale.y = -0.01;
		if (currentReso == tablet) {
			this.text.anchor.y = 0.8;
			this.text.style.fontSize = 34;
		} else if (currentReso == mobile) {
			this.text.anchor.y = 0.8;
			this.text.style.fontSize = 24;
		}
    this.el.addChild(this.text);

    this.text2 = new PIXI.Text(t, {
      fontFamily: 'Poppins Regular',
      fontSize: 14,
			fontWeight: "bold",
      fill: 0x000
    });
    this.text2.anchor.x = 0.5;
    this.text2.anchor.y = -1;
    this.text2.position.x = 0;
    this.text2.scale.x = 0.01;
    this.text2.scale.y = -0.01;
		if (currentReso == tablet) {
			this.text2.anchor.y = -0.4;
			this.text2.style.wordWrap = true;
		} else if (currentReso == mobile) {
			this.text2.anchor.y = -0.6;
			this.text2.style.fontSize = 10;
			this.text2.style.wordWrap = true;
		}
    this.el.addChild(this.text2);

    this.shape = new p2.Circle({radius: this.radius});

    let startX = x % 2 === 0 ? 2 + r : -2 - r;
    let startY = r - Math.random() * (r * 2);
    this.body = new p2.Body({
      mass: m,
      position: [startX, startY],
      angularVelocity: 0,
      fixedRotation: true
    });
    this.body.addShape(this.shape);
    interaction3World.addBody(this.body);
    this.timer = null;
  }

  this.update = function () {
    this.body.applyForce([-this.body.position[0] / 100, -this.body.position[1] / 100]);

    this.el.position.x = this.body.position[0];
    this.el.position.y = this.body.position[1];
    this.el.rotation = this.body.angle;
  }

  this.mouseover = function () {
    if (!this.timer) {
      let movementX = interaction3Movement.x;
      let movementY = interaction3Movement.y;
			if (movementX == undefined || movementY == undefined) {
				return;
			}
      if (movementX > 50) {
        movementX = 50;
      } else if (movementX < -50) {
        movementX = -50;
      }

      if (movementY > 50) {
        movementY = 50;
      } else if (movementY < -50) {
        movementY = -50;
      }

      let forceX, forceY;
      forceX = scale(movementX, -50, 50, -Math.abs(this.sMin * this.body.position[0]), Math.abs(this.sMax * this.body.position[0]));
      forceY = scale(movementY, -50, 50, Math.abs(this.sMin * this.body.position[1]), -Math.abs(this.sMax * this.body.position[1]));

      this.body.applyForce([forceX, forceY]);
      this.timer = setTimeout(() => {
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    }
  }

	this.updateValues = (i) => {
		const r = interaction3Data[i].radius;
		const delta = 0.05;
		const dur1 = 0.4;
		const dur2 = 0.15;

		const tl = gsap.timeline({paused: true});
		tl.to(this.circle.scale, {keyframes: [{x: r + delta, y: r + delta, duration: dur1}, {x: r - 2*delta, y: r - 2*delta, duration: dur2}, {x: r, y: r, duration: dur2}], 
			onUpdate: () => {
				this.shape.radius = this.circle.scale.x;
				this.body.updateBoundingRadius();
			},
			onComplete: () => {
				this.shape.radius = r;
				this.body.mass = interaction3Data[i].mass;
				this.sMin = interaction3Data[i].sMin;
				this.sMax = interaction3Data[i].sMax;
				this.text.text = interaction3Data[i].value + "%";
				this.text2.text = interaction3Data[i].name;
			}})
			.to(this.bubble, {keyframes: [{width: (r + delta) * 2.3, height: (r + delta) * 2.3, duration: dur1}, {width: (r - 2*delta) * 2.3, height: (r - 2*delta) * 2.3, duration: dur2}, {width: 2.3 * r, height: r * 2.3, duration: dur2}]}, "<");
		tl.play();
	}

	this.updateOnResize = (i, reso) => {
		const r = interaction3Data[i].radius;
		this.circle.scale.x = this.circle.scale.y = r;
		this.bubble.width = this.bubble.height = r * 2.3;
		this.shape.radius = r;
		this.body.updateBoundingRadius();
		this.text2.style.fontSize = 14;
		if (reso == mobile) {
			this.text.style.fontSize = 24;
			this.text.anchor.y = 0.8;
			this.text2.anchor.y = -0.6;
			this.text2.style.fontSize = 10;
			this.text2.style.wordWrap = true;
		} else if (reso == tablet) {
			this.text.style.fontSize = 34;
			this.text.anchor.y = 0.8;
			this.text2.anchor.y = -0.4;
			this.text2.style.wordWrap = true;
		} else if (reso == desktop) {
			this.text.style.fontSize = 40;
			this.text.anchor.y = 0.7;
			this.text2.anchor.y = -1;
			this.text2.style.wordWrap = false;
		}
	}

  this.init.call(this);
  this.circle.mouseover = this.mouseover.bind(this);
}

const observer2 = new IntersectionObserver(handleIntersect, options);
observer2.observe(interaction3Canvas);
/* Interaction 3 end */

// Change Graph1 Bars x-position in Mobile & Mobile+ reso
const changeGraph1BarsPositionOnResize = (reso) => {
	let xPos = -16;
	let xDiff = 8;

	// Space out bars more in Mobile reso as they are too close in Mobile 
	if (reso == mobile) {
		xPos = -22;
		xDiff = 11;
	}

	for (let i = 0; i < graph1Bars.length; i++) {
		graph1Bars[i].position.x = xPos;
		xPos += xDiff;
	}
}

// Change Graph2 Bars x-position in Mobile & >Mobile
const changeGraph2BarsPositionOnResize = (reso) => {
	let xPos = -17.5;
	let xDiff = 7;
	if (reso == mobile) {
		xPos = -22.5;
		xDiff = 9;
	}
	const initialXPosValue = xPos;

	for (let i = 0; i < bars.length; i++) {
		for (let j = 0; j < bars[i].length; j++) {
			bars[i][j].position.x = xPos;
		}
		xPos += xDiff;
	}
}

// Give slide names correct left position on resize in Mobile reso
const changeScrollLeftOnResizeInMobileReso = (currentSlideNum, ul, lis) => {
	ul.scroll({
		left: ul.scrollLeft + lis[currentSlideNum].getBoundingClientRect().left
	});
}

// Window resize handler
const onWindowResize = () => {
	const windowWidth = body.clientWidth;

	if (windowWidth < 768) {
		changeScrollLeftOnResizeInMobileReso(graph1CurrentGraphMobile, graphNamesUlMobile, graphNamesLisMobile);
		if (currentReso != mobile) {
			widthToHeightRatio = 1.85;
		}
	} else {
		if (currentReso == mobile) {
			widthToHeightRatio = 1.73;
		}
	}
	graph1CanvasContainerWidth = graph1CanvasContainer.getBoundingClientRect().width;
	graph1Camera.aspect = graph1CanvasContainerWidth / (graph1CanvasContainerWidth / widthToHeightRatio);
	graph1Camera.updateProjectionMatrix();
	graph1Renderer.setSize(graph1CanvasContainerWidth, graph1CanvasContainerWidth / widthToHeightRatio);
	if (windowWidth < 768) {
		if (currentReso != mobile) {
			changeGraph1BarsPositionOnResize(mobile);
		}
	} else {
		if (currentReso == mobile) {
			changeGraph1BarsPositionOnResize();
		}
	}
	calculateGraphBarWidth(true, graph1Bars[0], graph1Camera, graph1Canvas, 1);
	graph1BarInitialPosition = calculateBarsBotPosition(graph1Camera, graph1Canvas);
	for (let i = 0; i < graph1Bars.length; i++) {
		updatePositionOfGraphValues(i, true);
	}
	graph1AppendOrUpdateGraphXValues(true);

	canvasContainerWidth = canvasContainer.getBoundingClientRect().width;
	camera.aspect = canvasContainerWidth / (canvasContainerWidth / widthToHeightRatio);
	camera.updateProjectionMatrix();
	renderer.setSize(canvasContainerWidth, canvasContainerWidth / widthToHeightRatio);
	if (windowWidth < 768) {
		if (currentReso != mobile) {
			changeGraph2BarsPositionOnResize(mobile);
		}
	} else {
		if (currentReso == mobile) {
			changeGraph2BarsPositionOnResize();
		}
	}
	if (bars[0] && bars[0][0]) {
		calculateGraphBarWidth(true, bars[0][0], camera, canvas, 2);
		barsInitialPosition = calculateBarsBotPosition(camera, canvas);
		appendGraphXValues(true);
	}
	interaction3CanvasContainerWidth = interaction3CanvasContainer.getBoundingClientRect().width;

	if (windowWidth < 768) {
		interaction3Renderer.resize(interaction3CanvasContainerWidth, interaction3MobileHeight);
		interaction3Stage.position.y = interaction3MobileHeight / 2;
		if (currentReso != mobile) {
			setCurrentReso();
			updateRadiusOnResize(mobile);
			if (!$.scrollify.isDisabled()) {
				$.scrollify.disable();
				$.scrollify.setOptions({setHeights: false});
				removeScrollifySectionHeightInMobile();
			}
		}
		changeScrollLeftOnResizeInMobileReso(interaction3CurrentSlideMobile, interaction3NamesUlMobile, interaction3NamesLisMobile);
	} else if (windowWidth < 1024) {
		interaction3Renderer.resize(interaction3CanvasContainerWidth, interaction3TabletHeight);
		interaction3Stage.position.y = interaction3TabletHeight / 2;
		if (currentReso != tablet) {
			setCurrentReso();
			updateRadiusOnResize(tablet);
			if ($.scrollify.isDisabled()) {
				$.scrollify.setOptions({setHeights: true});
				$.scrollify.enable();
			}
		}
	} else if (windowWidth >= 1024) {
		interaction3Renderer.resize(interaction3CanvasContainerWidth, interaction3DesktopHeight);
		interaction3Stage.position.y = interaction3DesktopHeight / 2;
		if (currentReso != desktop) {
			setCurrentReso();
			updateRadiusOnResize(desktop);
			if ($.scrollify.isDisabled()) {
				$.scrollify.setOptions({setHeights: true});
				$.scrollify.enable();
			}
		}
	}

	interaction3Stage.position.x = interaction3CanvasContainerWidth / 2; // center at origin
	planeBody.position = [0, -1];

	onAnimateChanges();
}

// Add Window resize handler
let resizeCompleteTimer;
window.addEventListener("resize", () => {
	clearTimeout(resizeCompleteTimer);
	resizeCompleteTimer = setTimeout(onWindowResize, 300);
});

// Check if an element is partially visible in viewport based on given percent value
const isElementXPercentInViewport = (el, percentVisible) => {
  let rect = el.getBoundingClientRect(),
    windowHeight = (window.innerHeight || document.documentElement.clientHeight);

  return !(
    Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percentVisible ||
    Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
  )
}

// Animate function
const onAnimateChanges = () => {
	// Graph 1
	if (isElementXPercentInViewport(graph1Canvas, 1)) {
		if (currentReso != mobile) {
			graph1Raycaster.setFromCamera(graph1Mouse, graph1Camera);
			// calculate objects intersecting the picking ray
			const graph1Intersects = graph1Raycaster.intersectObjects(graph1Holder.children);
			if (graph1Intersects.length == 2) {
				for (let i = 0; i < graph1Bars.length; i++) {
					if (graph1Bars[i].uuid == graph1Intersects[0].object.uuid) {
						graph1RotateBar(graph1Bars[i], graph1RotationTl[i], graph1CurrentRotationSpeedAndDirectionOfBars[i]);
					}
				}
			}
		}
		graph1Raycaster2.setFromCamera(graph1Touch, graph1Camera);
		const graph1Intersects2 = graph1Raycaster2.intersectObjects(graph1Holder.children);
		if (graph1Intersects2.length == 2) {
			for (let i = 0; i < graph1Bars.length; i++) {
				if (graph1Bars[i].uuid == graph1Intersects2[0].object.uuid && graph1Touch.x != "") {
					graphRotateBarOnSwipe(graph1Bars[i], graph1RotationTl[i], graph1CurrentRotationSpeedAndDirectionOfBars[i], graph1Touch, lastTouchLocation);
				}
			}
		}
		setRotationAngleOfBarsBasedOnScrollPosition();
		if (currentReso != mobile) {
			tiltGraphBasedOnMouseXPosition(graph1Canvas, graph1MouseXCanvas, graph1Holder);
		} else {
			if (graph1Holder.rotation.y != 0) {
				graph1Holder.rotation.y = 0;
			}
		}
		graph1Renderer.render(graph1Scene, graph1Camera);
	}

	// Graph 2
	if (isElementXPercentInViewport(canvas, 1)) {
		if (currentReso != mobile) {
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(holder.children);
			if (intersects.length == 2) {
				for (let i = 0; i < bars.length; i++) {
					for (let j = 0; j < bars[i].length; j++) {
						if (bars[i][j].uuid == intersects[0].object.uuid) {
							rotateBar(bars[i][j], rotationTl[i][j], currentRotationSpeedAndDirectionOfBars[i][j]);
						}
					}
				}
			}
		}
		graph2Raycaster2.setFromCamera(graph2Touch, camera);
		const graph2Intersects2 = graph2Raycaster2.intersectObjects(holder.children);
		if (graph2Intersects2.length == 2) {
			for (let i = 0; i < bars.length; i++) {
				for (let j = 0; j < bars[i].length; j++) {
					if (bars[i][j].uuid == graph2Intersects2[0].object.uuid) {
						if (graph2Touch.x != "" && graph2Touch.y != "") {
							graphRotateBarOnSwipe(bars[i][j], rotationTl[i][j], currentRotationSpeedAndDirectionOfBars[i][j], graph2Touch, graph2LastTouchLocation);
						}
					}
				}
			}
		}
		graph2SetRotationAngleOfBarsBasedOnScrollPosition();
		if (currentReso != mobile) {
			tiltGraphBasedOnMouseXPosition(canvas, mouseXCanvas, holder);
		} else {
			if (holder.rotation.y != 0) {
				holder.rotation.y = 0;
			}
		}
		renderer.render(scene, camera);
	}

	// Spheres Interaction
	if (isElementXPercentInViewport(interaction3Canvas, 5)) {
		interaction3World.step(1/60);
		for (var i = 0; i < interaction3Balls.length; i++) {
			interaction3Balls[i].update();
		}
		interaction3Renderer.render(interaction3Stage);
	}
}

const animate = () => {
	requestAnimationFrame(animate);
	onAnimateChanges();
}
animate();