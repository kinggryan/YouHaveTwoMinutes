#pragma strict

var target:Transform;
var downwardLookAngle:float;
var lookDistance:float;
var relativeVector:Vector3;

function Start () {
	relativeVector = Vector3(0,Mathf.Sin(downwardLookAngle*Mathf.Deg2Rad)*lookDistance,-Mathf.Cos(downwardLookAngle*Mathf.Deg2Rad)*lookDistance);
	transform.position = target.position + relativeVector;
	transform.LookAt(target);
}

function Update () {
	if(Input.GetKeyDown("q")) {
		RotateCameraClockwise();
	}
	else if(Input.GetKeyDown("e")) {
		RotateCameraCounterClockwise();
	}
	
	transform.position = target.position + relativeVector;
}

function RotateCameraClockwise() {
	var rotation = Quaternion.AngleAxis(90,Vector3.up);
	relativeVector = rotation*relativeVector;
	transform.rotation = rotation*transform.rotation;
}

function RotateCameraCounterClockwise() {
	var rotation = Quaternion.AngleAxis(-90,Vector3.up);
	relativeVector = rotation*relativeVector;
	transform.rotation = rotation*transform.rotation;
}