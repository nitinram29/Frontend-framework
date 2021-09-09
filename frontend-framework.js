//JRock starts
function $$$(cid)
{
let element = document.getElementById(cid);
if(!element) throw "Invalid id : " + cid;
return new JRockElement(element);
}

$$$.model={
"onStartup":[],
"accordians":[]
}

$$$.accordianHeadingClicked = function(accordianIndex,panelIndex)
{
if($$$.model.accordians[accordianIndex].expandedIndex!=-1) $$$.model.accordians[accordianIndex].panels[$$$.model.accordians[accordianIndex].expandedIndex].style.display = 'none';
$$$.model.accordians[accordianIndex].panels[panelIndex+1].style.display = $$$.model.accordians[accordianIndex].panels[panelIndex+1].oldDisplay;
$$$.model.accordians[accordianIndex].expandedIndex = panelIndex+1;
}//accordianHeadingClicked

$$$.toAccordian=function(accord)
{
var panels=[];
var expandedIndex = -1;
let children = accord.childNodes;
var x;
for(x=0;x<children.length;x++)
{
//alert(children[x].nodeName);
if(children[x].nodeName!='#text')
{
panels[panels.length]=children[x];
}
}//for
if(panels.length%2!=0) throw "Heading and division malformed to create accrodian";
for(x=0;x<panels.length;x+=2)
{
if(panels[x].nodeName!='H3') throw "1 Heading and division malformed to create accrodian";
if(panels[x+1].nodeName!='DIV') throw "2 Heading and division malformed to create accrodian";
}//for

function createClickHandler(accordianIndex,panelIndex)
{
return function(){
$$$.accordianHeadingClicked(accordianIndex,panelIndex);
}
}//creatClickHandler
let accordianIndex = $$$.model.accordians.length;
for(x=0;x<panels.length;x+=2)
{
panels[x].onclick = createClickHandler(accordianIndex,x);
panels[x+1].oldDisplay = panels[x+1].style.display;
panels[x+1].style.display = 'none';
}//for

$$$.model.accordians[accordianIndex]={
"panels":panels,
"expandedIndex":-1 
}
}

$$$.initFramework=function(){
let allTags = document.getElementsByTagName("*");
let t=null;
let a=null;
for(var i=0;i<allTags.length;i++){
t=allTags[i];
if(t.hasAttribute("accordian")){
a= t.getAttribute("accordian");
if((typeof a)!='string') throw "Expected string, Found "+(typeof typeof a); 
if(a=="") 
{
$$$.toAccordian(t);
}
else throw "accordian property don't need any assignment.";
}
}

let x=0;
while(x<$$$.model.onStartup.length){
$$$.model.onStartup[x]();
x++;
}
}
// part of JRock
window.addEventListener("load",function(){
$$$.initFramework();
});

function JRockElement(element)
{
this.element = element;
this.html = function(content){
if(typeof this.element.innerHTML == "string"){
if(typeof content == "string"){ 	
this.element.innerHTML = content;
}
return this.element.innerHTML;
}
return null;
}// html function ends here

this.value = function(content){
if(typeof this.element.value){
if(typeof content == "string"){
this.element.value = content;
}
return this.element.value;
}
return null;
}// value function ends here

this.fillComboBox = function(jsonString){
//alert(this.element.nodeName);
if(this.element.nodeName!="SELECT") throw "fillComboBox function can only be used with SELECT element";


if(!jsonString["dataSource"]) throw "dataSource property is missing in call to ajax";
let dataSource = jsonString["dataSource"];
if((typeof dataSource)!="object") throw "dataSource property should be of String type in call to ajax";

if(!jsonString["text"]) throw "text property is missing in call to ajax";
let text = jsonString["text"];
if((typeof text)!="string") throw "text property should be of String type in call to ajax";

if(!jsonString["value"]) throw "value property is missing in call to ajax";
let value = jsonString["value"];
if((typeof value)!="string") throw "value property should be of String type in call to ajax";

if(!dataSource[0][text]) throw "dataSource property must have "+text+" property.";
if(!dataSource[0][value]) throw "dataSource property must have "+value+" property.";

// check for firstOption and enter that not doing now...
var firstOption = false;
if(jsonString["firstOption"]) firstOption = true;
//alert(JSON.stringify(jsonString["firstOption"]));
if(Object.keys(jsonString["firstOption"]).length != 2) throw "firstOption property must contain 2 property (text and value).";
if(!jsonString["firstOption"]["text"]) throw "firstOption property must contain text property.";
if(!jsonString["firstOption"]["value"]) throw "firstOption property must contain value property.";


element.innerHTML = "";
if(firstOption)
{
var opt = document.createElement('option');
opt.value = jsonString["firstOption"]["value"];
opt.innerHTML = (jsonString["firstOption"]["text"]);
opt.selected;
this.element.appendChild(opt);
}

for(k in dataSource)
{
var opt = document.createElement('option');
opt.value = dataSource[k][value];
opt.innerHTML =dataSource[k][text];
this.element.appendChild(opt);
}
}// fillComboBox function ends here
}// JRockElement class ends here


$$$.ajax = function(jsonString)
{
if(!jsonString["url"]) throw "url property is missing in call to ajax";
let url = jsonString["url"];
if((typeof url)!="string") throw "url property should be of String type in call to ajax";
let methodType = "GET";
if(jsonString["methodType"])
{
methodType = jsonString["methodType"];
if((typeof methodType)!="string") throw "methodType property should be of String type in call to ajax";
methodType = methodType.toUpperCase();
if(["GET","POST"].includes(methodType) == false) throw "methodType property should be GET/POST type in call to ajax";
}
let onSuccess = null;
if(jsonString["success"])
{
onSuccess = jsonString["success"];
if((typeof onSuccess)!="function") throw "success property should be a function type in call to ajax";
}
let onFailure = null;
if(jsonString["failure"])
{
onFailure = jsonString["failure"];
if((typeof onFailure)!="function") throw "failure property should be a function type in call to ajax";
}
if(methodType == "GET")
{
var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange = function() {
if(this.readyState==4)
{
if(this.status==200)
{
var responseData = this.responseText;
if(onSuccess) onSuccess(responseData);
}
else
{
if(onFailure) onFailure();
}
}
}// onreadystatechange ends here
if(jsonString["data"])
{
var queryString="";
var xx = 0;
let jsonData = jsonString["data"];
for(k in jsonData)
{
if(xx==0) queryString += "?";
if(xx>0) queryString += "&";
xx++;
//alert(jsonData[k]);
queryString+=encodeURI(k);
queryString+="=";
queryString+=encodeURI(jsonData[k]);
//alert(queryString);
}
url+=queryString;
//url+="?";
//alert(url);
}
xmlHttpRequest.open(methodType,url,true); // true means request is asynchronous
xmlHttpRequest.send();
}

if(methodType == "POST")
{
var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.onreadystatechange = function() {
if(this.readyState==4)
{
if(this.status==200)
{
var responseData = this.responseText;
if(onSuccess) onSuccess(responseData);
}
else
{
alert(this.status);
if(onFailure) onFailure();
}
}
}// onreadystatechange ends here

let jsonData={};
let sendJSON = jsonString["sendJSON"];
if(!sendJSON) sendJSON=false;
if((typeof sendJSON)!="boolean") throw "sendJSON property should be of boolean type";
let queryString;
if(jsonString["data"])
{
if(sendJSON)
{
jsonData = jsonString["data"];
}
else
{
jsonData = jsonString["data"];
queryString="";
let xx = 0;
for(k in jsonData)
{
//if(xx==0) queryString += "?";
if(xx>0) queryString += "&";
xx++;
queryString+=encodeURI(k);
queryString+="=";
queryString+=encodeURI(jsonData[k]);

}
}
}
xmlHttpRequest.open(methodType,url,true); // true means request is asynchronous
if(sendJSON)
{
xmlHttpRequest.setRequestHeader("Content-Type","application/json");
xmlHttpRequest.send(JSON.stringify(jsonData));
}
else
{
xmlHttpRequest.setRequestHeader("Content-Type",'application/x-www-form-urlencoded');
xmlHttpRequest.send(queryString);
}
}
}//JRock ends
