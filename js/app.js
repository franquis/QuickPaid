window.participants = [{"id":"001","nom":"Marc","totaux":{}},{"id":"002","nom":"Antoine","totaux":{}},{"id":"003","nom":"Mathieu","totaux":{}},{"id":"004","nom":"Arnaud","totaux":{}}];

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
function TableCtrl($scope){
	
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
		participant.totaux.rembourse = r;
		return r;
	}
	
	$scope.comptesDepense = function(participant){
		var r = 0;
		
		angular.forEach($scope.depenses, function(depense){
			if( depense.payeur == participant.id) {
				r += depense.montant;
			}
		});
		participant.totaux.depense = r;
		return r;
	}
	
	$scope.comptesDelta = function(participant){
		return participant.totaux.depense - participant.totaux.rembourse;
	}
}

function Table2Ctrl($scope){

	$scope.selected = [];
	$scope.entities = [{"title":"Title1","id":1},{"id":2,"title":"Title2"}];

	var updateSelected = function(action, id) {
		if (action == 'add' & $scope.selected.indexOf(id) == -1)
			$scope.selected.push(id);
		if (action == 'remove' && $scope.selected.indexOf(id) != -1)
			$scope.selected.splice($scope.selected.indexOf(id), 1);
	}

	$scope.updateSelection = function($event, id) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, id);
	};

	$scope.selectAll = function($event) {
		var checkbox = $event.target;
		var action = (checkbox.checked ? 'add' : 'remove');
		for ( var i = 0; i < $scope.entities.length; i++) {
			var entity = $scope.entities[i];
			updateSelected(action, entity.id);
		}
	};

	$scope.getSelectedClass = function(entity) {
		return $scope.isSelected(entity.id) ? 'selected' : '';
	};

	$scope.isSelected = function(id) {
		return $scope.selected.indexOf(id) >= 0;
	};

	//something extra I couldn't resist adding :)
	$scope.isSelectedAll = function() {
		return $scope.selected.length === $scope.entities.length;
	};
}

