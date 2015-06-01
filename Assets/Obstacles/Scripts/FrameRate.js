#pragma strict

var text:UnityEngine.UI.Text;

function Start () {

}

function Update () {
	text.text = "" + (1/Time.smoothDeltaTime);
}