#pragma strict

var resetPosition:Vector3;

function OnTriggerEnter(other:Collider) {
	if(other.GetComponent(PhysicsCar)) {
		var rigid = other.GetComponent(Rigidbody);
		rigid.MovePosition(resetPosition);
	}
}	