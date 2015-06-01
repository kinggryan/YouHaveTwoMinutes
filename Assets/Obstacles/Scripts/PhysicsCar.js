#pragma strict

var brakeForce:float = 10;
var driveSpeed:float = 5;

function Start () {
	GetComponent(Rigidbody).velocity = driveSpeed*transform.forward;
}

function FixedUpdate() {
	transform.position += driveSpeed*transform.forward*Time.fixedDeltaTime;
}

function OnCollisionEnter(collision:Collision) {
	// Figure out if the collision was in the front of the car
	var hitPoint = collision.contacts[0].point;	
	var frontHitPlane = Plane(transform.forward,transform.TransformPoint(0,0,0.48));

	if(Vector3.Angle(collision.contacts[0].normal,-1*transform.forward) < 1) {
		GetComponent(Rigidbody).drag = brakeForce;
				
		var pr = collision.collider.GetComponent(PhysicsRunner);
		if(pr != null) {
			//Knock the runner away
			pr.Stun(1.5);
			var prrigidbody = pr.GetComponent(Rigidbody) as Rigidbody;
			prrigidbody.constraints = RigidbodyConstraints.None;
			prrigidbody.AddForce(transform.forward*driveSpeed*1.05,ForceMode.Impulse);
			prrigidbody.AddForce(2*Vector3.up,ForceMode.Impulse);
		}
	}
}