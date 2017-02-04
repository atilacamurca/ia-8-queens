function argmin_random_tie(a,b){a=a||[];var c=a.length;if(0===c)return null;for(var d=b(a[0]),e=null,f=0,g=0;c>g;g++){var h=a[g],i=b(h);d>i?(e=h,d=i,f=1):i===d&&(f++,0===_.random(0,f)&&(e=h))}return e}function argmax_random_tie(a,b){return argmin_random_tie(a,function(a){return-1*b(a)})}function arrayOf(a,b){b=b||0;for(var c=[],d=0;a>d;d++)c[d]=0;return c}!function(){var a=!1,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){},Class.extend=function(c){function d(){!a&&this.init&&this.init.apply(this,arguments)}var e=this.prototype;a=!0;var f=new this;a=!1;for(var g in c)f[g]="function"==typeof c[g]&&"function"==typeof e[g]&&b.test(c[g])?function(a,b){return function(){var c=this._super;this._super=e[a];var d=b.apply(this,arguments);return this._super=c,d}}(g,c[g]):c[g];return d.prototype=f,d.prototype.constructor=d,d.extend=arguments.callee,window&&(window.Class=d),d}}(),function(a){fracPart=function(b){return+(+b).toExponential().replace(a,function(a,b,c,d,e){var f=Array(Math.abs(e)+2).join("0");return c=(f+c+(d?"":".")+f).split("."),+(b+"."+c.join("").slice(+e+c[0].length))})}}(/(-?)(\d+(\.?)\d*)e(.+)/),angular.module("ia8queensApp",["ngCookies","ngResource","ngSanitize","ngRoute"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("ia8queensApp").controller("MainCtrl",["$scope","HillClimbing","Genetic","SimulatedAnnealing",function(a,b,c,d){function e(){var b=a.cnf.numQueens,c=b,d=0,e=0,f="c\n";f+="c DIMACS generated for "+b+" queens\n",f+="c\n";for(var g="c at least one queen per line\n",h="c not (2 queens on the same line)\n",i="c not (2 queens on the same column)\n",j="c not (2 queens on the same diagonal)\n",k=0;b>k;k++){for(var l=0;b>l;l++){g+=""+(k*b+l+1)+" ";for(var m=l+1;b>m;m++)h+="-"+(k*b+l+1)+" ",h+="-"+(k*b+m+1)+" 0\n",d++,i+="-"+(l*b+k+1)+" ",i+="-"+(m*b+k+1)+" 0\n",e++}g+="0\n"}f+="p cnf "+b*b+" "+(c+d+e)+"\n",f+=g,f+=h,f+=i,f+=j,a.cnf.dimacs=f}a.board=[[0,0,0,1,0,0,0,0],[0,0,0,0,0,0,0,1],[0,0,0,0,1,0,0,0],[0,1,0,0,0,0,0,0],[0,0,0,0,0,1,0,0],[1,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0],[0,0,0,0,0,0,1,0]],a.message=null,a.cls_message=null,a.g_info=null,a.cnf={dimacs:"",numQueens:4,options:[4,5,6,7,8]},a.strategies=[{id:"hc",description:"Hill Climbing"},{id:"sa",description:"Simulated Annealing"},{id:"ga",description:"Genetic Algorithm"},{id:"tab",description:"Tableaux"},{id:"res",description:"Resolution"}],a.strategy="tab",a.g_options={startSize:75,maxEpochs:1e3,matingProbability:.7,mutationRate:.001,minSelect:10,maxSelect:50,offspringPerGeneration:20,minShuffles:8,maxShuffles:20,PBCMax:4,maxLength:8},a.sa_options={initialTemperature:30,finalTemperature:.5,alpha:.99,stepsPerChange:100},a.color=function(a,b){var c=a%2===0,c=b%2===0?c:!c;return c},a.solve=function(){if(a.message=null,a.cls_message=null,a.g_info=null,"hc"===a.strategy){var g=new b;a.board=g.solve(),0!=g.cost?(a.message="Solution not found!",a.cls_message="alert-danger"):(a.message="Solution found!",a.cls_message="alert-success")}else if("ga"===a.strategy){var g=new c(a.g_options.startSize,a.g_options.maxEpochs,a.g_options.matingProbability,a.g_options.mutationRate,a.g_options.minSelect,a.g_options.maxSelect,a.g_options.offspringPerGeneration,a.g_options.minShuffles,a.g_options.maxShuffles,a.g_options.PBCMax,a.g_options.maxLength);g.initializeChromosomes(),g.solve();var h=g.solution.data;console.log("best solution: ",h),8===h.length?(f(h),a.message="Solution found!",a.cls_message="alert-success"):(a.message="Solution not found!",a.cls_message="alert-danger"),a.g_info={epoch:g.epoch,mutations:g.mutations,childCount:g.childCount,solution:h}}else if("sa"===a.strategy){var g=new d(a.sa_options.initialTemperature,a.sa_options.finalTemperature,a.sa_options.alpha,a.sa_options.stepsPerChange),h=g.solve();console.log(h),f(h),a.message="Solution found!",a.cls_message="alert-success"}else"tab"===a.strategy?e():"res"===a.strategy&&e()};var f=function(b){for(var c=0;c<b.length;c++)for(var d=0;d<b.length;d++)b[c]===d?a.board[c][d]=1:a.board[c][d]=0}}]),angular.module("ia8queensApp").factory("Problem",function(){var a=Class.extend({init:function(a,b){this.initial=a,this.goal=b},actions:function(a){return null},result:function(a,b){return null},goalTest:function(a){return a===this.goal},pathCost:function(a,b,c,d){return a+1},value:function(a){return null}});return a}),angular.module("ia8queensApp").factory("Board",function(){var a=Class.extend({init:function(){this.matrix=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]],this.boardSize=this.matrix.length;for(var a=0;a<this.boardSize;a++){var b=_.random(0,this.boardSize-1);this.matrix[a][b]=1}},print:function(){var a="<";a+=this.matrix[0].indexOf(1);for(var b=1;b<this.boardSize;b++)a+=","+this.matrix[b].indexOf(1);return a+=">"},toOneDimension:function(){for(var a=this.boardSize,b=[],c=0;a>c;c++)b[c]=this.matrix[c].indexOf(1);return b}});return a}),angular.module("ia8queensApp").factory("HillClimbing",["Board",function(a){var b=Class.extend({init:function(){this.board=new a,this.cost=this.heuristic(this.board),console.log("initial board: ",this.board.print()),console.log("initial cost: ",this.cost)},solve:function(){for(var a=500,b=0;a>b;){var c=this.cost;if(this.findLowerCostBoard(),console.log("cost: ",this.cost),c<=this.cost)break;console.log("Number of violations: ",this.heuristic(this.board)),console.log("number of steps: ",b),b++}return 0!=this.cost?console.log("solution not found"):console.log("solution found"),console.log(this.board.print()),this.board.matrix},findLowerCostBoard:function(){for(var a=this.heuristic(this.board),b=this.board,c=this.board.boardSize,d=0;c>d;d++)for(var e=0;c>e;e++)if(1===this.board.matrix[d][e])for(var f=0;c>f;f++)for(var g=0;c>g;g++)if(1!==this.board.matrix[f][g]){var h=this.clone(this.board);h.matrix[d][e]=0,h.matrix[f][g]=1;var i=this.heuristic(h);a>i&&(a=i,b=h)}this.board=b,this.cost=a},heuristic:function(a){for(var b=a.boardSize,c=0,d=0,e=0;b>e;e++)for(var f=0;b>f;f++)if(1===a.matrix[e][f]){c-=2;for(var g=0;b>g;g++)1===a.matrix[e][g]&&c++,1===a.matrix[g][f]&&c++;for(var g=e+1,h=f+1;b>g&&b>h;)1===a.matrix[g][h]&&d++,g++,h++;for(g=e+1,h=f-1;b>g&&h>=0;)1===a.matrix[g][h]&&d++,g++,h--;for(g=e-1,h=f+1;g>=0&&b>h;)1===a.matrix[g][h]&&d++,g--,h++;for(g=e-1,h=f-1;g>=0&&h>=0;)1===a.matrix[g][h]&&d++,g--,h--}return(d+c)/2},clone:function(b){for(var c=b.boardSize,d=new a,e=0;c>e;e++)for(var f=0;c>f;f++)d.matrix[e][f]=b.matrix[e][f];return d}});return b}]),angular.module("ia8queensApp").factory("NQueensProblem",["Problem",function(a){var b=a.extend({init:function(a){this.boardSize=a||8,this.initial=new Array(this.boardSize);for(var b=0;b<this.boardSize;b++)this.initial[b]=_.random(0,this.boardSize-1);this.solved=-1,console.log("board: ",this.initial)},actions:function(a){-1==this.solved&&(this.solved=0);for(var b=this.solved,c=[],d=0;d<this.boardSize;d++)this.conflicted(a,d,b)||c.push(d);return console.log("actions: ",c),this.solved++,c},result:function(a,b){for(var c=a[this.solved],d=[],e=a.length,f=0;e>f;f++)d.push(a[f]);return d[c]=b,d},conflicted:function(a,b,c){for(var d=0;c>d;d++)if(this.conflict(b,c,a[d],d))return!0;return!1},conflict:function(a,b,c,d){return a===c||b===d||a-b===c-d||a+b===c+d},goalTest:function(a){for(var b=a.length,c=0;b>c;c++)if(this.conflicted(a,a[c],c))return!1;return!0},value:function(a){for(var b=a.length,c=0,d=0;b>d;d++)for(var e=1;b>e+d;e++)a[d]===a[e+d]&&c++,a[d]-e===a[e+d]&&c++,a[d]+e===a[e+d]&&c++;return console.log("result: ",c),c}});return b}]),angular.module("ia8queensApp").factory("Chromosome",function(){var a=Class.extend({init:function(a){this.maxLength=a,this.fitness=0,this.selected=!1,this.selectionProbability=0,this.conflicts=0,this.data=[];for(var b=0;b<this.maxLength;b++)this.data.push(b)},computeConflicts:function(){for(var a=0,b=0,c=0,d=0,e=[],f=0,g=[-1,1,-1,1],h=[-1,1,1,-1],i=0;i<this.maxLength;i++)e[i]=arrayOf(this.maxLength),e[i][this.data[i]]=1;for(var i=0;i<this.maxLength;i++){a=i,b=this.data[i];for(var j=0;j<g.length;j++)for(c=a,d=b;;){if(c+=g[j],d+=h[j],0>c||c>=this.maxLength||0>d||d>=this.maxLength)break;1===e[c][d]&&f++}}this.conflicts=f}});return a}),angular.module("ia8queensApp").factory("Genetic",["Chromosome",function(a){var b=Class.extend({init:function(a,b,c,d,e,f,g,h,i,j,k){this.mStartSize=a,this.mMaxEpochs=b,this.mMatingProbability=c,this.mMutationRate=d,this.mMinSelect=e,this.mMaxSelect=f,this.mOffspringPerGeneration=g,this.mMinShuffles=h,this.mMaxShuffles=i,this.mPBCMax=j,this.mMaxLength=k,this.epoch=0,this.childCount=0,this.nextMutation=0,this.mutations=0,this.population=[],this.solution=null},getExclusiveRandomInteger:function(a,b){for(var c=0;;)if(c=_.random(0,a-1),c!==b)break;return c},getExclusiveRandomIntegerByArray:function(a,b,c){var d=!1,e=0;if(b!==a)for(;!d;){d=!0,e=_.random(a,b-1);for(var f=c.length,g=0;f>g;g++)e===c[g]&&(d=!1)}else e=b;return e},mathRound:function(a){return fracPart(a)>=.5?Math.ceil(a):Math.floor(a)},getMaximum:function(){for(var b=0,c=new a(this.mMaxLength),d=new a(this.mMaxLength),e=0,f=!1,g=!1;!g;){f=!1,b=this.population.length;for(var h=0;b>h;h++)h!==e&&(c=this.population[h],d=this.population[e],c.conflicts>d.conflicts&&(e=h,f=!0));f||(g=!0)}return e},getMinimum:function(){for(var b=0,c=new a(this.mMaxLength),d=new a(this.mMaxLength),e=0,f=!1;;){f=!1,b=this.population.length;for(var g=0;b>g;g++)g!==e&&(c=this.population[g],d=this.population[e],c.conflicts<d.conflicts&&(e=g,f=!0));if(!f)break}return e},exchangeMutation:function(a,b){var c=0,d=0,e=null,f=0,g=0;for(e=this.population[a];;){if(f=_.random(0,this.mMaxLength-1),g=this.getExclusiveRandomInteger(this.mMaxLength,f),d=e.data[f],e.data[f]=e.data[g],e.data[g]=d,c===b)break;c++}this.mutations++},initializeChromosomes:function(){for(var b=0;b<this.mStartSize;b++){var c=new a(this.mMaxLength),d=this.population.push(c),e=d-1,f=_.random(this.mMinShuffles,this.mMaxShuffles-1);this.exchangeMutation(e,f),c=this.population[e],c.computeConflicts()}},getFitness:function(){var a=this.population.length,b=null,c=0,d=0;b=this.population[this.getMaximum()],d=b.conflicts,b=this.population[this.getMinimum()],c=d-b.conflicts;for(var e=0;a>e;e++)b=this.population[e],b.fitness=100*(d-b.conflicts)/c},rouletteSelection:function(){for(var b=0,c=this.population.length,d=0,e=0,f=0,g=new a(this.mMaxLength),h=new a(this.mMaxLength),i=0;c>i;i++)g=this.population[i],d+=g.fitness;d*=.01;for(var i=0;c>i;i++)g=this.population[i],g.selectionProbability=g.fitness/d;for(var i=0;i<this.mOffspringPerGeneration;i++)for(f=_.random(0,98),b=0,e=0;;){if(g=this.population[b],e+=g.selectionProbability,e>=f){h=0===b?this.population[b]:b>=c-1?this.population[c-1]:this.population[b-1],h.selected=!0;break}b++}},chooseFirstParent:function(){for(var a=0,b=null;;)if(a=_.random(0,this.population.length-2),b=this.population[a],b.selected)break;return a},chooseSecondParent:function(b){for(var c=0,d=new a(this.mMaxLength);;)if(c=_.random(0,this.population.length-2),c!=b&&(d=this.population[c],d.selected))break;return c},partiallyMappedCrossover:function(a,b,c,d){var e=this.population[a],f=this.population[b],g=this.population[c],h=this.population[d],i=_.random(0,this.mMaxLength-1),j=this.getExclusiveRandomInteger(this.mMaxLength,i);if(i>j){var k=i;i=j,j=k}for(var l=0;l<this.mMaxLength;l++)g.data[l]=e.data[l],h.data[l]=f.data[l];for(var l=i;j>=l;l++){for(var m=e.data[l],n=f.data[l],o=0,p=0,q=0;q<this.mMaxLength;q++)g.data[q]===m?o=q:g.data[q]===n&&(p=q);m!==n&&(g.data[o]=n,g.data[p]=m);for(var q=0;q<this.mMaxLength;q++)h.data[q]===n?o=q:h.data[q]===m&&(p=q);m!==n&&(h.data[o]=m,h.data[p]=n)}},positionBasedCrossover:function(a,b,c,d){var e=0,f=0,g=arrayOf(this.mMaxLength),h=arrayOf(this.mMaxLength),i=!1,j=this.population[a],k=this.population[b],l=this.population[c],m=this.population[d];f=_.random(0,this.mPBCMax-1);for(var n=arrayOf(f),o=0;f>o;o++)n[o]=this.getExclusiveRandomIntegerByArray(0,this.mMaxLength-1,n);for(var o=0;o<this.mMaxLength;o++){i=!1;for(var p=0;f>p;p++)k.data[o]===j.data[n[p]]&&(i=!0);i||(g[e]=k.data[o],e++)}for(var o=0;f>o;o++)l.data[n[o]]=j.data[n[o]];e=0;for(var o=0;o<this.mMaxLength;o++){i=!1;for(var p=0;f>p;p++)o===n[p]&&(i=!0);i||(l.data[o]=g[e],e++)}e=0;for(var o=0;o<this.mMaxLength;o++){i=!1;for(var p=0;f>p;p++)j.data[o]===k.data[n[p]]&&(i=!0),i||(h[e]=j.data[o],e++)}for(var o=0;f>o;o++)m.data[n[o]]=k.data[n[o]];e=0;for(var o=0;o<this.mMaxLength;o++){i=!1;for(var p=0;f>p;p++)o===n[p]&&(i=!0),i||(m.data[o]=h[e],e++)}},displacementMutation:function(a){var b=0,c=0,d=0,e=arrayOf(this.mMaxLength),f=arrayOf(this.mMaxLength),g=this.population[a];c=_.random(0,this.mMaxLength-1);var h=this.mMaxLength-(c+2);0>=h&&(h=1),d=this.getExclusiveRandomInteger(h,c);for(var i=0;i<this.mMaxLength;i++)(c>i||i>c+length)&&(e[b]=g.data[i],b++);b=0;for(var i=c;c>=i;i++)f[b]=g.data[i],b++;b=0;for(var i=d;d>=i;i++)g.data[b]=f[b],b++;b=0;for(var i=0;i<this.mMaxLength;i++)(d>i||i>d+length)&&(g.data[i]=e[b],b++);this.mutations++},doMating:function(){for(var b=0,c=0,d=0,e=null,f=null,g=0;g<this.mOffspringPerGeneration;g++)if(c=this.chooseFirstParent(),b=_.random(0,99),b<=100*this.mMatingProbability){d=this.chooseSecondParent(c),e=new a(this.mMaxLength),f=new a(this.mMaxLength);var h=this.population.push(e),i=h-1;h=this.population.push(f);var j=h-1;this.partiallyMappedCrossover(c,d,i,j),this.childCount-1===this.nextMutation?this.exchangeMutation(i,1):this.childCount===this.nextMutation&&this.exchangeMutation(j,1),e=this.population[i],e.computeConflicts(),f=this.population[j],f.computeConflicts(),this.childCount+=2,this.childCount%this.mathRound(1/this.mMutationRate)==0&&(this.nextMutation=this.childCount+_.random(0,this.mathRound(1/this.mMutationRate)-1))}},prepNextEpoch:function(){var a=0,b=null;a=this.population.length;for(var c=0;a>c;c++)b=this.population[c],b.selected=!1},solve:function(){var a=0,b=null,c=!1;for(this.mutations=0,this.nextMutation=_.random(0,this.mathRound(1/this.mMutationRate)-1);!c;){a=this.population.length;for(var d=0;a>d;d++)b=this.population[d],(0===b.conflicts||this.epoch===this.mEpochs)&&(c=!0);this.getFitness(),this.rouletteSelection(),this.doMating(),this.prepNextEpoch(),this.epoch++,console.log("Epoch: ",this.epoch)}if(console.log("done."),this.epoch!=this.mEpochs){a=this.population.length;for(var d=0;a>d;d++)b=this.population[d],0===b.conflicts&&(this.solution=b)}console.log("Completed ",this.epoch," epochs."),console.log("Encountered ",this.mutations," mutations in ",this.childCount," offspring.")}});return b}]),angular.module("ia8queensApp").factory("SimulatedAnnealing",function(){var a=Class.extend({init:function(a,b,c,d){this.initialTemperature=a,this.finalTemperature=b,this.alpha=c,this.stepsPerChange=d,this.maxLength=8,this.currentSolution=arrayOf(this.maxLength,-1),this.bestSolution=arrayOf(this.maxLength,-1),this.workingSolution=arrayOf(this.maxLength,-1),this.workingEnergy=0,this.bestEnergy=0,this.currentEnergy=0,this.setRandomNumberGenerator=!1},solve:function(){for(var a=0,b=!1,c=0,d=this.initialTemperature,e=0;e<this.maxLength;e++){for(var f=this.getLargeRandom(this.maxLength),g=0;e>g;g++)for(;f===this.workingSolution[g];)f=this.getLargeRandom(this.maxLength),g=0;this.workingSolution[e]=f,this.currentSolution[e]=f,this.bestSolution[e]=f}for(this.workingEnergy=this.computeEnergy(this.workingSolution),this.currentEnergy=this.computeEnergy(this.currentSolution),this.bestEnergy=this.computeEnergy(this.bestSolution);d>this.finalTemperature;){for(c=0,a=0;a<this.stepsPerChange;a++){if(b=!1,this.tweakSolution(this.workingSolution),this.workingEnergy=this.computeEnergy(this.workingSolution),this.workingEnergy<this.currentEnergy)b=!0;else{var h=this.getSmallRandom(),i=this.workingEnergy-this.currentEnergy,j=Math.exp(-i/d);j>h&&(c++,b=!0)}if(b){b=!1,this.currentEnergy=this.workingEnergy;for(var e=0;e<this.maxLength;e++)this.currentSolution[e]=this.workingSolution[e];if(this.currentEnergy<this.bestEnergy){this.bestEnergy=this.currentEnergy;for(var e=0;e<this.maxLength;e++)this.bestSolution[e]=this.currentSolution[e]}}else{this.workingEnergy=this.currentEnergy;for(var e=0;e<this.maxLength;e++)this.workingSolution[e]=this.currentSolution[e]}}if(d*=this.alpha,0===this.bestEnergy)break}return console.log("best energy: ",this.bestEnergy),console.log("steps: ",a),this.bestSolution},getSmallRandom:function(){return Math.random()},getLargeRandom:function(a){return _.random(0,a-1)},tweakSolution:function(a){for(var b=0,c=this.getLargeRandom(this.maxLength),d=this.getLargeRandom(this.maxLength);c===d;)d=this.getLargeRandom(this.maxLength);b=a[c],a[c]=a[d],a[d]=b},computeEnergy:function(a){for(var b=0,c=0;c<this.maxLength-1;c++)for(var d=0,e=c+1;e<this.maxLength;e++)d++,a[c]-d===a[e]&&b++,a[c]+d===a[e]&&b++;return b}});return a});