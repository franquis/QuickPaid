/*
@see http://briantford.com/blog/angular-express.html
@see http://briantford.com/blog/angular-d3.html
*/
/*
window.participants = [{"id":"001","nom":"Marc","data":{}},{"id":"002","nom":"Antoine","data":{}},{"id":"003","nom":"Mathieu","data":{}},{"id":"004","nom":"Arnaud","data":{}}];

window.depenses = [
		{"id":1,"description":"Péage","date":"03/12/2012","montant":26.8,"participants":["001","002"],"payeur":"001"},
		{"id":2,"description":"Essence","date":"04/12/2012","montant":86.5,"participants":["002","004"],"payeur":"003"}
	];
*/
angular.module('QuickPaid', [])
	.directive('datepicker',function(){
		var linker = function(scope,element,attr) {
	        $(element).pikaday({
	        	firstDay: 1,
	        	format: 'DD/MM/YYYY',
	        	i18n: {
	        		months        : ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aôut','Septembre','Octobre','Novembre','Décembre'],
	        		weekdays      : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
	        		weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
	        	},
	        	onSelect: function(a){
	        		$(element).trigger('change');
	        	}
	        });
	        
	    };
		
		return {
			restrict:'A',
			link: linker
		}
	}).directive("evGraph",function(){
		
		var margin = 20,
			width = '100%',
			height = 100,// - .5 - margin,
			color = d3.interpolateRgb("#fff", "#ffe");
 		
 		
		var linker = function(scope,element,attr){
			var data = [];
			
			
			
			var dates = [];
			var num_days = 15; //Nombre de jours a afficher
			
			var today = new Date();
			var year = today.getFullYear();
			var month = today.getMonth()
			var day = today.getDay();
			
			
			var format = d3.time.format("%d/%m");
			
		
			
			//Todo, créer un tableau
			/*
				[ date: J1, val: 0, J2: 2309, J3: 920]
			*/
			for(var i = (num_days+1); i > 0; i--){
				var d = new Date(year, month, day - i);
				dates.push(d);
			}
			
			
			scope.$parent.depensesByUser.forEach(function(a,i){
				var index = dates.indexOf(a.date);
				//Si la dépense n'a pas eu lieu le dernier mois..
				if( index === -1 ){
					data[index] = {"date":a.date,"value":0};
				} else {
					data[index] = {"date":a.date,"value":a.montant};
				}
			});
		
			for(var i in dates){
				data.push({
					"date": dates[i],
					"value": 0
				});
			}
			
			
			var vis = d3.select(element[0])
				.append("svg")
				.attr("width", width)
				.attr("height", height);
			
			var rect = vis.selectAll('rect')
				.data(data)
				.enter().append("rect")
				.attr('x',function(d,i){
					return i*(700/(num_days+2));
				})
				.attr('y',function(d,i){
					return 80 - i*5;
				})
				.attr('fill','#b73d6c')
				.attr('width',10)
				.attr('height',function(d,i){
					return i*5;
				});
			
			var line = vis.append("rect")
				.attr('y', 79)
				.attr('x', 5)
				.attr("width", 700)
				.attr("height", 2)
				.attr('fill','#3A87AD');
			
			var circle = vis.selectAll("circle")
			    .data(dates)
			  	.enter().append("circle")
			    .attr("cx", function(d,i){return i*(700/(num_days+2))+5;})
			    .attr("cy", 80)
			    .attr('title', function(d,i){
			    	return format(d);
			    })
			    .attr('rel','tooltip')
			    .attr('class','days')
				.attr('fill','#3A87AD')
			    .attr("r", 4);
			
			
			
			
			var labels = vis.selectAll("text.label")
				.data(dates)
				.enter().append("text")
				.attr("class", "label")
				.attr("x", 5)
				.attr("y", 90)
				.attr("dx", function(d,i){return i*(700/(num_days+2))+8;})
				.attr("dy", ".71em")
				.attr("class","dates")
				.attr("text-anchor", "middle")
				.text(function(d, i) {
					return format(d);
				});
			/*
			vis.selectAll("rect")
				.data(data)
				.enter().append("rect")
				.attr("y", function(d, i) {return d.value; })
				.attr("width", 110)
				.attr("height", 20);
			*/
			scope.$watch('$parent.depensesByUser', function (newVal, oldVal) {
				console.log(newVal);
			
			});
		
		};
		return {
			restrict: 'E',
			scope: {
				val: '=',
				//grouped: '='
			},
			link: linker
		}
	
	});

$(document).ready(function(){
	$('#main').show();
	$('[rel=tooltip]').tooltip();
	
	$('a[href="#"]').click(function(e){
		e.preventDefault();
		
	});
	
	/*$('.gridster ul').gridster({
		widget_margins: [10, 10],
		widget_base_dimensions: [140, 140]
		
	});*/
});


function DepenseCtrl($scope){
	
	
	$scope.depense = $scope.$parent.depense;
	
	
	$scope.edit = function(){
		
		console.log("edit " + "tr#depense_"+$scope.depense.id+ " .edit");
		
		$("tr#depense_"+$scope.depense.id+ " .edit").show();
		$("tr#depense_"+$scope.depense.id+ " .view").hide();
		return false;
	}
	
	$scope.save = function(){
		$("tr#depense_"+$scope.depense.id+ " .edit").hide();
		$("tr#depense_"+$scope.depense.id+ " .view").show();
		return false;
	}
	
	$scope.remove = function(){
		console.log($scope.$root);
		//var a = $scope.$root.getDepense($scope.depense.id);
		//$scope.depenses.splice(a,1);
		return false;
	}
	
	
	$scope.cancel = function(){
		if(confirm("Annuler les modifications?")){
			$("tr#depense_"+$scope.depense.id+ " .edit").hide();
			$("tr#depense_"+$scope.depense.id+ " .view").show();
		}
	}
	
	
}



function ParticipantCtrl($scope){
	
	$scope.participant = $scope.$parent.participant;
	
	$scope.$watch('participant',function(a){
		
	});
	
	$scope.isParticipant = function(){
		var depense = $scope.$parent.depense;
		var i;
		for(i = 0; i < depense.participants.length; ++i) {
			if (depense.participants[i] == $scope.participant.id)
				return "selected";
		}
		return "";
		
	}
	
	
	$scope.update = function($event){
		var depense = $scope.depense;
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		var p_id = $scope.participant.id;
		
		if (action == 'add' & $scope.depense.participants.indexOf(p_id) == -1)
			$scope.depense.participants.push(p_id);
			
		if (action == 'remove' && $scope.depense.participants.indexOf(p_id) != -1)
			$scope.depense.participants.splice($scope.depense.participants.indexOf(p_id), 1);
		
		$scope.$root.$emit('update');
		
	}
	
	$scope.$root.$on('update',function(a,b,c){
		console.log('update');
		$scope.aRembourser();
		$scope.aDepenser();
		$scope.Balance();
	});
	
	
	
	$scope.aRembourser = function(){
		
		participant = $scope.participant;
		var r = 0;
		
		angular.forEach($scope.depenses, function(depense){
			var montant_indiv = depense.montant / depense.participants.length;
			for(var i = 0; i < depense.participants.length; ++i){
				if( depense.participants[i] == participant.id) {
					r += montant_indiv;
				}
			}
		});
		participant.data.rembourse = r;
		return r;
	}
	
	$scope.aDepenser = function(){
		var r = 0;
		participant = $scope.participant;
		
		angular.forEach($scope.depenses, function(depense){
			if( depense.payeur == participant.id) {
				r += depense.montant;
			}
		});
		participant.data.depense = r;
		return r;
	}
	
	$scope.Balance = function(){
		
		return $scope.participant.data.depense - $scope.participant.data.rembourse;
		
	}


}

function Aggregator($scope){
	

	$scope.repartitionData = [{
		key: "Rep"
	}];
	
	$scope.updateRepartition = function(){
		var total = 0;
		var a = []
		angular.forEach($scope.$parent.participants, function(participant){
			var pc = (participant.data.depense / $scope.$parent.totalDepense)*100;
			a.push({"nom":participant.nom,"pc":pc});
			
		});
		$scope.repartitionData[0].values = a;
		$scope.buildRepartitionGraph();
	}

	$scope.buildRepartitionGraph = function(){
		
		nv.addGraph(function() {
			var chart = nv.models.pieChart()
				.x(function(d) { return d.nom })
				.y(function(d) { return d.pc })
				.showLabels(true)
				.tooltips(true);
			
			d3.select("#repGraph svg")
				.datum($scope.repartitionData)
				.transition().duration(1200)
				.call(chart);
			
			return chart;
		});
	}
	
	$scope.$watch("depenses",function(a,b){
		$scope.updateRepartition();
	});
	
	$scope.$root.$on('update',function(a,b,c){
		$scope.updateRepartition();
		console.log($scope.$root);
	});
	

}

/*
function RemboursementCtrl($scope){


	$scope.remboursements = [];
	
	
		
	$scope.genereRemboursements = function(){
		
		var a = [];
		angular.forEach($scope.participants, function(participant,i){
			var delta = participant.data.depense - participant.data.rembourse;
			a.push({"id":participant.id,"montant":delta});
		});
				
		while( a.length > 0){
			// On tri le tableau par montant croisant
			a.sort(function(a,b) { return parseFloat(a.montant) - parseFloat(b.montant);});
			
			var b = {"receveur":"","montant":0,"debiteur":""};
			
			// Le plus gros debiteur est le premier element du tableau i.e -50€
			var debiteur = a[0];
			// Le plus gros crediteur est le dernier element du tableau i.e 40€
			var receveur = a[a.length -1];
			
			if(receveur == debiteur){
				break;
			}
			
			// On calcule la diff entre les deux montant i.e -50 + 40 = -10
			var diff = Math.round( (debiteur.montant + receveur.montant)*100)/100;
			
			//Si la différence est positive, le debiteur a remboursé sa dette, il est exclu du tableau
			if(diff > 0){
				a.splice(0, 1);
				receveur.montant = diff;
				
				b.montant = Math.abs(debiteur.montant);
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			//Si la différence est négative, le receveur est totalement remboursé, il est exclu du tableau
			} else if(diff < 0){
				
				debiteur.montant = diff;
				
				a.splice(a.length -1, 1);
				
				b.montant = Math.abs(receveur.montant);
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			//Si la différence est nulle, le receveur et le debiteur sont exclus du tableau
			} else {
				a.splice(0, 1);
				a.splice(a.length -1, 1);
				b.montant = receveur.montant;
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			}
			if(b.montant != 0)
				$scope.remboursements.push(b);
		}
			
		return false;
	}

}

*/

function CurrentUserCtrl($scope){

	$scope.depensesByUser = [];

	$scope.getDepensesForUser = function(){
		var currentUser = $scope.$parent.currentUser.id;
		
		angular.forEach($scope.depenses,function(depense){
			if(depense.payeur === currentUser){
				$scope.depensesByUser.push(depense);
			}
		
		});

	};
	
	$scope.getDepensesForUser();
	console.log($scope.depensesByUser);
}

function AppCtrl($scope,$http){

	$scope.title = "";
	
	$scope.currentUser = {"username":"Matthieu","id":"003"};
	
	$scope.remboursements = [];
	
	$scope.totalDepense = 0;
	
	$scope.participants =[ { "id": "001", "nom": "Marc", "data": { "depense": 26.8, "rembourse": 13.4 } }, { "id": "002", "nom": "Antoine", "data": { "depense": 0, "rembourse": 56.65 } }, { "id": "003", "nom": "Mathieu", "data": { "depense": 86.5, "rembourse": 0 } }, { "id": "004", "nom": "Arnaud", "data": { "depense": 0, "rembourse": 43.25 } } ];
	
	
	$scope.depenses = [
		{"id":1,"description":"Péage","date":new Date("2012-12-03"),"montant":26.8,"participants":["001","002"],"payeur":"001"},
		{"id":2,"description":"Essence","date":new Date("2012-12-04"),"montant":86.5,"participants":["002","004"],"payeur":"003"},
		{"id":3,"description":"Courses","date":new Date("2012-12-05"),"montant":123.5,"participants":["002","003"],"payeur":"003"},
		{"id":4,"description":"Location","date":new Date("2012-12-08"),"montant":60,"participants":["003","004"],"payeur":"003"}
	];
	
	
	
	
	$scope.isParticipant = function(depense, participant){
		var i;
		for(i = 0; i < depense.participants.length; ++i) {
			if (depense.participants[i] == participant.id)
				return "selected";
		}
		return "";
		
	}
	
	$scope.getDepense = function(id){
		var k;
		for (k = 0; k < $scope.depenses.length; ++k) {
			if (id === $scope.depenses[k].id){
				return $scope.depenses[k];
			} else {
				return "";
			}
		}
	};
	
	$scope.calcTotalDepense = function(){
	
		$scope.totalDepense = 0;
		angular.forEach($scope.depenses,function(depense){
			$scope.totalDepense += depense.montant;
		});
		
	}
	
	$scope.toggleParticipants = function(){
		$('#participantsList').fadeIn();
	
	}
	
	$scope.getPayeur = function(depense){
		return $scope.getParticipant(depense.payeur);
	}
	
	$scope.getParticipant = function(id){
		var k;
		for (k = 0; k < $scope.participants.length; ++k) {
			if (id == $scope.participants[k].id){
				return $scope.participants[k];
			}
		}
	};
	
	$scope.genereRemboursements = function(){
		
		$scope.remboursements = [];
		var a = [];
		angular.forEach($scope.participants, function(participant,i){
			var delta = participant.data.depense - participant.data.rembourse;
			a.push({"id":participant.id,"montant":delta});
		});
				
		while( a.length > 0){
			// On tri le tableau par montant croisant
			a.sort(function(a,b) { return parseFloat(a.montant) - parseFloat(b.montant);});
			
			var b = {"receveur":"","montant":0,"debiteur":""};
			
			// Le plus gros debiteur est le premier element du tableau i.e -50€
			var debiteur = a[0];
			// Le plus gros crediteur est le dernier element du tableau i.e 40€
			var receveur = a[a.length -1];
			
			if(receveur == debiteur){
				break;
			}
			
			// On calcule la diff entre les deux montant i.e -50 + 40 = -10
			var diff = Math.round( (debiteur.montant + receveur.montant)*100)/100;
			
			//Si la différence est positive, le debiteur a remboursé sa dette, il est exclu du tableau
			if(diff > 0){
				a.splice(0, 1);
				receveur.montant = diff;
				
				b.montant = Math.abs(debiteur.montant);
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			//Si la différence est négative, le receveur est totalement remboursé, il est exclu du tableau
			} else if(diff < 0){
				
				debiteur.montant = diff;
				
				a.splice(a.length -1, 1);
				
				b.montant = Math.abs(receveur.montant);
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			//Si la différence est nulle, le receveur et le debiteur sont exclus du tableau
			} else {
				a.splice(0, 1);
				a.splice(a.length -1, 1);
				b.montant = receveur.montant;
				b.receveur = $scope.getParticipant(receveur.id).nom;
				b.debiteur = $scope.getParticipant(debiteur.id).nom;
			}
			if(b.montant != 0)
				$scope.remboursements.push(b);
		}
			
		return false;
	}
	
	
	$scope.$root.$on('update',function(a,b,c){
		$scope.calcTotalDepense();
		//$scope.$parent.totalDepense += depense.montant;
		$scope.genereRemboursements();
	});
	
	$scope.$watch('depenses',function(a){
		$scope.calcTotalDepense();
		//$scope.$root.$emit('update');
	});
	
	$scope.$watch('participants',function(a){
		//$scope.$root.$emit('update');
	});
}

