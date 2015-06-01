#pragma strict

enum NPCWalkMode { Cycle };

var walkWaypoints:Vector3[];
var maximumSpeed:float;
var maximumAcceleration:float;
var cornerReachedDistance:float = 1;
var walkMode:NPCWalkMode = NPCWalkMode.Cycle;

private var path:NavMeshPath;
private var currentCorner:int;
private var npcRigidbody:Rigidbody;
private var pathRecalculateTime = 0.1;
private var pathRecalculateTimer = 0f;
private var stunned:boolean = false;
private var targetPosition:Vector3;
private var targetPositionIndex = 0;

function Start () {
	// Initialize the path
	currentCorner = 1;
	
	npcRigidbody = GetComponent(Rigidbody);
	targetPosition = walkWaypoints[0];
}

function Update () {
	// If we reached the destination, update the target
	if(path != null && Vector3.Distance(transform.position + Vector3(0,-0.5,0),path.corners[currentCorner]) < cornerReachedDistance) {
		currentCorner++;
		
		Debug.Log("Corner updating");
		// if we reached the end of the path, go to the next point as the target point
		if(currentCorner >= path.corners.Length) {
			Debug.Log("Corner cycling");
			currentCorner = 0;
			targetPositionIndex++;
			
			// if we reached the end of all waypoints and we're on cycle mode, go to point 1
			if(walkMode == NPCWalkMode.Cycle && targetPositionIndex >= walkWaypoints.Length) {
				Debug.Log("Position cycling");
				targetPositionIndex = 0;
			}
			targetPosition = walkWaypoints[targetPositionIndex];
			Debug.Log("Target set: " +targetPosition);
		}
	}
	
	pathRecalculateTimer += Time.deltaTime;
	
	// Update the corner
	if(pathRecalculateTimer > pathRecalculateTime) {
		pathRecalculateTimer = 0;
		
		var tempPath:NavMeshPath = NavMeshPath();
		if(NavMesh.CalculatePath(transform.position,targetPosition,NavMesh.AllAreas,tempPath)) {
			path = tempPath;
		}	
	}
	
	if(path != null) {
		for (var i = 0; i < path.corners.Length-1; i++)
			Debug.DrawLine(path.corners[i], path.corners[i+1], Color.blue);
	
		// Add force towards the correct direction
		var differenceInVelocity = maximumSpeed*(path.corners[currentCorner] - transform.position).normalized - npcRigidbody.velocity;
		var force = maximumAcceleration*differenceInVelocity;
		
		npcRigidbody.AddForce(force);
	}
}

function OnDrawGizmos() {
	// Draw the NPC's path
	for (var i = 0; i < walkWaypoints.Length; i++) {
		var endIndex = (i+1)%walkWaypoints.Length;
		Gizmos.color = Color.red;
		Gizmos.DrawLine(walkWaypoints[i], walkWaypoints[endIndex]);
	}
}

function OnTriggerStay(other:Collider) {
	// If the other has an npc obstacle attached, move gently away from it
	if(other.GetComponent(NPCObstacle) != null) {
		var distance = Vector3.Distance(other.transform.position,transform.position);
		var forceDirection = Vector3.ProjectOnPlane(transform.position - other.transform.position,npcRigidbody.velocity);
		npcRigidbody.AddForce(forceDirection.normalized*2.2);
	}
}

function OnCollisionEnter(collision:Collision) {
	if(collision.collider.GetComponent(PhysicsRunner)) {
		if(collision.relativeVelocity.magnitude > 5) {
			npcRigidbody.constraints = RigidbodyConstraints.None;
			this.enabled = false;
		}
	}
}