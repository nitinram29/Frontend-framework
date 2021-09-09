# Frontend-framework

Features added :

    1) To send request of GET and POST type.
    2) To creat Accordian
    3) To fill combo box
    4) ...working to add more
    
To send GET type request :



    function getDesignation()
    {
    let title = $$$("title"); // $$$(<id of element");
    title.html("");  // .html(""); ==.innerHTML = "";
    let code = $$$("code").value(); 
    $$$.ajax({
      "url": "servletTwo",
      "data": {
      "code": code
      },
      "methodType": "GET",
      "success": function(responseData){
        if(responseData == "INVALID")
        {
          alert("Designation code not exists.");
          title.html("");
        }
        else
        {
          var splits=responseData.split(",");
          title.html(splits[1]);
        }
      },
      "failure": function(){
        alert('some problem');
      }
    });
    }
    
To send POST type request :

     function getDesignation()
      {
        var firstName = $$$("firstName").value();
        var lastName = $$$("lastName").value();
        var age = $$$("age").value();
        var customer={
          "firstName":firstName,
          "lastName":lastName,
          "age":age
        };
        var whatever = $$$("whatever");
        whatever.html = "";
        $$$.ajax({
          "methodType":"POST",
          "url": "servletThree",
          "data": customer,
          "sendJSON": false,
          "success": function(responseData){
             //when sendJSON is true
             /*var a = JSON.parse(responseData);
             var o = "First Name : " + a.firstName + "<br>";
             o+= "Last Name : " + a.lastName + "<br>";
             o+= "Age : " + a.age + "<br>";
             $$$("whatever").html(o); 
             */
             // when sendJSON is false
             var splits = responseData.split(",");
             $$$('whatever').html("First name : " + splits[0] + "<br>Last name : " + splits[1] + "<br>Age : " + splits[2]);
          },
          "failure": function(){
             alert('some problem');
          }
        });
      }



To fill combo box


      function populateDesignations()
      {
        $$$.ajax({
          "url": "servletOne",
          "methodType": "GET",
          "success": function(responseData)
          {
            var designations = JSON.parse(responseData);
            $$$('designationCode').fillComboBox({    //designationCode is id associate with select tag
              "dataSource":designations,
              "text": "title",
              "value": "code",
              "firstOption":{
                "text":"Select designation",
                "value": "-1"
              }
            });
          },
          "failure": function()
          {
            alert('some problem');
          }
        });
      }



To create Accordian :

    <div accordian> 
      <h3>Heading 1</h3>
      <div>
        Content 1
      </div>
      
      <h3>Heading 2</h3>
      <div>
        Content 2
      </div>
      
      <h3>Heading 3</h3>
      <div>
        Content 3
      </div>
    </div>




