#pragma strict

var maxDriveSpeed:float;
var acceleration:float;
var brakeAcceleration:float;
var driveForward:boolean = true;
private var velocity:Vector3;
private var characterController:CharacterController;

function Start () {
	characterController = GetComponent(CharacterController);
}

function Update () {
	var tempPosition = transform.position;
	if(driveForward)
		Accelerate();
	else
		Brake();
	characterController.Move(velocity*Time.deltaTime);
	velocity = (transform.position - tempPosition)/Time.deltaTime;
}

function Accelerate() {
	velocity = Vector3.MoveTowards(velocity,maxDriveSpeed*transform.forward,acceleration*Time.deltaTime);
}

function Brake() {
	velocity = Vector3.MoveTowards(velocity,Vector3.zero,brakeAcceleration*Time.deltaTime);
}

function OnCollisionEnter(collision:Collision) {
	driveForward = false;
	var rcc = collision.collider.GetComponent(RunnerCharacterController);
	if(rcc != null)
		rcc.HitByCar(velocity);
}