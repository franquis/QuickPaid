/*
@see http://briantford.com/blog/angular-express.html
*/

window.participants = [{"id":"001","nom":"Marc","data":{}},{"id":"002","nom":"Antoine","data":{}},{"id":"003","nom":"Mathieu","data":{}},{"id":"004","nom":"Arnaud","data":{}}];

window.depenses = [
		{"id":1,"description":"Péage","date":"03/12/2012","montant":26.8,"participants":["001","002"],"payeur":"001"},
		{"id":2,"description":"Essence","date":"04/12/2012","montant":86.5,"participants":["002","004"],"payeur":"003"}
	];
$(document).ready(function(){
	$('[rel=tooltip]').tooltip();
	$('.datepicker').pikaday({
		firstDay: 1,
		format: 'DD/MM/YYYY',
		i18n: {
			months        : ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aôut','Septembre','Octobre','Novembre','Décembre'],
			weekdays      : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
			weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
		}
	});

});


function DepenseCtrl($scope){
	
	$scope.depenses = window.depenses;
	
	$scope.depense = {};
	
	$scope.edit = function(depense){
		console.log("edit " + "tr#depense_"+depense.id+ " .edit");
		$scope.depense = depense;
		$("tr#depense_"+depense.id+ " .edit").show();
		$("tr#depense_"+depense.id+ " .view").hide();
	
	}
	
	$scope.save = function(depense){
		console.log("save");
	}
	
	$scope.remove = function(depense){
		console.log("remove");
	}
	
	
	$scope.cancel = function(depense){
		console.log("cancel");
		if(confirm("Annuler les modifications?")){
			$("tr#depense_"+depense.id+ " .edit").hide();
			$("tr#depense_"+depense.id+ " .view").show();
		}
	}
	
}

function ParticipantCtrl($scope){}

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
		

	
		
		//
		console.log(b);
		
		return false;
	}

}


function TableCtrl($scope){
	
	
	
	$scope.remboursements = [];
	
	$scope.sommedepense = 0;
	
	$scope.participants = window.participants;
	$scope.depenses = window.depenses;
	
	
	
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

	$scope.update = function($event,depense,participant){
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateDepense(action, depense, participant.id);
	}
	
	var updateDepense = function(action, depense, p_id) {
		if (action == 'add' & depense.participants.indexOf(p_id) == -1)
			depense.participants.push(p_id);
			
		if (action == 'remove' && depense.participants.indexOf(p_id) != -1)
			depense.participants.splice(depense.participants.indexOf(p_id), 1);
			
	}
	
	$scope.comptesRembourse = function(participant){
		var r = 0;
		$scope.sommedepense = 0;
		angular.forEach($scope.depenses, function(depense){
			$scope.sommedepense += depense.montant;
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
	
	$scope.comptesDepense = function(participant){
		var r = 0;
		
		angular.forEach($scope.depenses, function(depense){
			if( depense.payeur == participant.id) {
				r += depense.montant;
			}
		});
		participant.data.depense = r;
		return r;
	}
	
	$scope.comptesBalance = function(participant){
		return participant.data.depense - participant.data.rembourse;
		
	}
	
	
	//Remboursements
	
	
	
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
		

	
		
		//
		console.log(b);
		
		return false;
	}
	
	$scope.$watch('depenses',function(a,b,c){
		console.log('depenses changed');
	});
	
	$scope.$watch('participants',function(a){
		console.log('participants changed');
		$scope.genereRemboursements();
	});
	
	//Participants
	
	$scope.toggleParticipants = function(){
		$('#participantsList').fadeIn();
	
	}
	
	//Depense CRUD
	
	$scope.edit = function(depense){
		console.log("edit " + "tr#depense_"+depense.id+ " .edit");
		$scope.depense = depense;
		$("tr#depense_"+depense.id+ " .edit").show();
		$("tr#depense_"+depense.id+ " .view").hide();
	
	}
	
	$scope.save = function(depense){
		console.log("save");
	}
	
	$scope.remove = function(depense){
		console.log("remove");
		if(confirm("Supprimer cette dépense?")){
			var i =	$scope.depenses.indexOf(depense);
			$scope.depenses.splice(i, 1);
		}
	}
	
	
	$scope.cancel = function(depense){
		console.log("cancel");
		if(confirm("Annuler les modifications?")){
			$("tr#depense_"+depense.id+ " .edit").hide();
			$("tr#depense_"+depense.id+ " .view").show();
		}
	}
}

