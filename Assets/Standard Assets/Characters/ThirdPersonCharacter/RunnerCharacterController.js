#pragma strict

var velocity: Vector3 = Vector3.zero;
var walkSpeed: float = 2.0;
var runSpeed:float = 15.0;
var walkAcceleration: float = 10.0;
var characterController:CharacterController;
var running:boolean = false;
var grounded:boolean = true;
var jumpSpeed:float = 5.0;
var inControl = true;

function Start () {

}

function Update () {
	PerformMovement();
}

function GetInputMovementVector() : Vector3 {
	var uncorrectedMovementVector = Vector3(Input.GetAxis("Horizontal"),0,Input.GetAxis("Vertical"));
	var cameraForward = Vector3(Camera.main.transform.forward.x,0,Camera.main.transform.forward.z).normalized;
	var rotation = Quaternion.FromToRotation(Vector3.forward,cameraForward);
	return(rotation*uncorrectedMovementVector);
}

function WalkRunMovement() {
	var frameSpeed = walkSpeed;
	if(running)
		frameSpeed = runSpeed;
	var inputMovement = GetInputMovementVector();
	var targetSpeed = frameSpeed*inputMovement;
	if(targetSpeed.magnitude > frameSpeed) 
		targetSpeed = frameSpeed*targetSpeed.normalized;
	velocity = Vector3.MoveTowards(velocity,targetSpeed,walkAcceleration*Time.deltaTime);
}

function PerformMovement() {
	var tempPosition = transform.position;
//	Jump();
	if(inControl) {
		GetRunning();
		WalkRunMovement();
	}
	else {
		InControlCheck();
	}
	ApplyGravity();
	characterController.Move(velocity*Time.deltaTime);
	velocity = (transform.position - tempPosition)/Time.deltaTime;
}

function ApplyGravity() {
	velocity += Vector3(0,-9.8*Time.deltaTime,0);
}

function GetRunning() {
	if(Input.GetButton("run")) {
		running = true;
	}
	else {
		running = false;
	}
}

function Jump() {
	if(Input.GetButtonDown("jump"))
		velocity += Vector3(0,jumpSpeed,0);
}

function HitByCar(carVelocity:Vector3) {
	// disable your own controls and enable the rigidbody
	inControl = false;
	grounded = false;
	velocity += carVelocity + Vector3(0,8,0);
}

function OnControllerColliderHit(hit:ControllerColliderHit) {
	// This is the ground if the normal is positive
	if(hit.normal.y > 0) {
		grounded = true;
	}
}

function InControlCheck() {
	if(grounded) {
		inControl = true;
	}
}