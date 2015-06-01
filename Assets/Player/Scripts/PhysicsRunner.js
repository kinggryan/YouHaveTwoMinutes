#pragma strict

var velocity: Vector3 = Vector3.zero;
var walkSpeed: float = 2.0;
var runSpeed:float = 15.0;
var maximumMovementForce:float = 10.0;
var jumpForce:float = 5.0;
var running:boolean = false;
var grounded:boolean = true;
var jumpSpeed:float = 5.0;
var inControl = true;
var runnerRigidbody:Rigidbody;
var walkingDragPerMeterPerSecond:float = 1.0;
var runningDragPerMeterPerSecond:float = 0.5;
var stunTimer = 0.0;

function Start () {
	runnerRigidbody = GetComponent(Rigidbody);
}

function Update () {
	if(stunTimer > 0)
		stunTimer = Mathf.Max(0,stunTimer-Time.deltaTime);
	else
		PerformMovement();
//	SetDrag();
}

function SetDrag() {
	if(IsGrounded()) {
		if(running)
			runnerRigidbody.drag = runnerRigidbody.velocity.magnitude*runningDragPerMeterPerSecond;
		else
			runnerRigidbody.drag = runnerRigidbody.velocity.magnitude*walkingDragPerMeterPerSecond;
	}
	else {
		Debug.Log("No Drag");
		runnerRigidbody.drag = 0;
	}
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
	var force = targetSpeed-runnerRigidbody.velocity;
	force *= maximumMovementForce;
		
	if(force.magnitude > maximumMovementForce) {
		force = maximumMovementForce*force.normalized;
	}
				
	runnerRigidbody.AddForce(force);
}

function PerformMovement() {
	GetRunning();
	JumpCheck();
	
	if(IsGrounded())
		WalkRunMovement();
}

function JumpCheck() {
	if(Input.GetButtonDown("jump") && IsGrounded()) {
		Debug.Log("th");
		Jump();
	}
}

function Jump() {
	if(!Standing()) {
		Stand();
	}
	
	runnerRigidbody.AddForce(Vector3.up*jumpForce,ForceMode.Impulse);
}

function GetRunning() {
	running = Input.GetButton("run");
}

function Stun(time:float) {
	stunTimer = time;
}

function IsGrounded() : boolean {
	var hitInfo:RaycastHit;
	if(Physics.Raycast(transform.position,-Vector3.up,hitInfo,1.05)) {
		return(true);
	}
	else
		return(false);
}

function Standing() : boolean {
	return(runnerRigidbody.constraints != RigidbodyConstraints.None);
}

function Stand() {
	var hitInfo:RaycastHit;
	if(Physics.Raycast(transform.position,-Vector3.up,hitInfo,1)) {
		runnerRigidbody.MovePosition(transform.position + Vector3(0,hitInfo.distance,0));
	}
	runnerRigidbody.MoveRotation(Quaternion.LookRotation(Vector3.forward,Vector3.up));
	
	runnerRigidbody.constraints = RigidbodyConstraints.FreezeRotation;
}