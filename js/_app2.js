function AppCtrl($scope){

	$scope.participants = [{"id":"001","nom":"Marc","data":{}},{"id":"002","nom":"Antoine","data":{}},{"id":"003","nom":"Mathieu","data":{}},{"id":"004","nom":"Arnaud","data":{}}];
	

}

function ParticipantCtrl($scope){

	
	$scope.edit = function(){
		console.log($scope.$parent.participant);
	
	};

}