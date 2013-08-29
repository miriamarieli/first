var users;
var tasks;
var thisId;
debugger;
//--------------------------------------------------------------document.ready 
 
$(document).ready(function(){
    start();
    
//--------------------------------------------------------------buttons 1    
    
    $("#table").on("click", "button",function (e)
        {
        var id=$(this).parent().parent()[0].id;//.closest('tr').attr(id);
        switch($(this).text())  
            {
                case "Show": fShowTask(id);
                             break;
                case "Edit": fEditTask(id);
                             break;
                case "Delete": destroy(id);
                               break;
            } 
        })
    
//--------------------------------------------------------------buttons 2    
    
    $("#formtable").on("change","select",function (e)
        {
        var ida=$(this).val();
        fselecttable(ida);                        
        });
    
    
//--------------------------------------------------------------

    $("#edittask").on("change","#valowner",function (e)
        {
        builder="";
        var ida=$(this).val();
        builder+="<label>assigned_to:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='valassigned_to'>";
        for (i in users) {
            if (users[i].parent_id==$("#valowner").val()) {
             nameId=findUserName(users[i].id);
             builder+="<option value='"+users[i].id+"'";
              if (nameId==findUserName(task['assigned_to'])) {
                builder+=" selected";
            }
            builder+=">"+nameId+"</option>";
        }
    }
    builder+="</select><br class='formbr'>";
    
    $("#valassigned_to").html(builder); 
        });
    
//--------------------------------------------------------------

$("#newtask").on("change","#newowner",function (e)
        {
        builder="";
        var ida=$(this).val();
        builder+="<label>assigned_to:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='newassigned_to'>";
        for (i in users)
        {
            if (users[i].parent_id==$("#newowner").val())
            {
             builder+="<option value='"+users[i].id+"'";
              if (i==1) {
            builder+=" selected";
                        }
            builder+=">"+users[i].name+"</option>";
            }
        }
    builder+="</select><br class='formbr'>";
    
    $("#newassigned_to").html(builder); 
        });
    
//--------------------------------------------------------------

    
    $("#formtable").on("click","button",function (e)
        {
           switch($(this).text())  
            {
                case "New Task":fNewTask();
                                break;
                case "Show all the tasks":fCreateTable(tasks);            
            }  
        })
    
//--------------------------------------------------------------buttons 3 
    
    $("#showdetails").on("click","button",function (e)
        {
            mytoggle("#showdetails","#formtable");
        })
        
    
//--------------------------------------------------------------buttons 4    
    
    $("#edittask").on("click","button",function (e)
        {        
            switch($(this).text())  
            {
                case "Back": mytoggle("#edittask","#formtable");
                break;
                case "New Task":fNewTask();
                                mytoggle("#edittask","#formtable");
                                break;
                case "Update": update(thisId);
                     mytoggle("#edittask","#formtable");
                     break;
            }
        });
    
//--------------------------------------------------------------buttons 5 

    $("#newtask").on("click","button",function (e)
        {
            switch($(this).text())  
            {
                case "Back": mytoggle("#newtask","#formtable");
                break;
                case "Save":create();
                            mytoggle("#formtable","#newtask");
                break;
            }
        })

//--------------------------------------------------------------status

function statusName(id) {
    var status;
    switch (id) {
        case 0:status="running";
            break;
        case 1:status="finished";
            break;
        case 2:status="beginning";
            break;
    }
    return status;
}

//--------------------------------------------------------------name by id

function findUserName(id) {
    for (var i in users){
        if (users[i].id==id)
            break;
    }
    return users[i].name; 
}

//--------------------------------------------------------------create task

 function create() {
    $.ajax({
    url: "/tasks/",
    type: "POST",
    dataType: 'json',
    data: {'task':{ 'assigned_to':$("#newassigned_to").val(),
                    'description':$("#newdescription").val(),
                    'name':$("#newname").val(),
                    'order':$("#neworder").val(),
                    'owner':$("#newowner").val(),
                    'status':$("#newstatus").val(),
                    'updated_at':$("#newupdated_at").val(),
                    'created_at':$("#newcreated_at").val()
                    }},
    success:function(res){
        tasks[res.id] = res;
        fCreateTable(tasks);
    }
    });
}

//--------------------------------------------------------------update

 function update(id) {
    var str="/tasks/"+id;
    $.ajax({
    url: str,
    type: "Put",
    dataType: 'json',
    data: {'task':{ 'assigned_to':$("#valassigned_to").val(),
                    'description':$("#valdescription").val(),
                    'name':$("#valname").val(),
                    'order':$("#valorder").val(),
                    'owner':$("#valowner").val(),
                    'status':$("#valstatus").val(),
                    'updated_at':$("#valupdated_at").val()
                    }},
    success:function(res){
       tasks[id]=res;
       fCreateTable(tasks);
    }
    });
}

//--------------------------------------------------------------destroy

 function destroy(id) {
    var str="/tasks/"+id;
    $.ajax({
    url: str,
    type: "delete",
    dataType: 'json',
    success:function(){
    delete tasks[id];
    fCreateTable(tasks);
    }
    });
}

//--------------------------------------------------------------toggle

function mytoggle(x,y) {
    $(x).toggle();
    $(y).toggle();
}

//--------------------------------------------------------------show

function fShowTask(id){
    task=tasks[id];
    builder="";
    builder+="<label>id:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['id']+"</label><br class='formbr'>";
    builder+="<label>name:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['name']+"</label><br class='formbr'>";
    builder+="<label>description:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['description']+"</label><br class='formbr'>";
    builder+="<label>order:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['order']+"</label><br class='formbr'>";
    builder+="<label>status:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+statusName(task['status'])+"</label><br class='formbr'>";
    builder+="<label>assignedto:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+findUserName(task['assigned_to'])+"</label><br class='formbr'>";
    builder+="<label>owner:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+findUserName(task['owner'])+"<br class='formbr'>";
    builder+="<label>created_at:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['created_at']+"</label><br class='formbr'>";
    builder+="<label>updated_at:</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>"+task['updated_at']+"</label><br class='formbr'>";
    builder+="<button>Back</button>";
    $("#edittask").html(builder);
    mytoggle("#edittask","#formtable");
}

//--------------------------------------------------------------edit

function fEditTask(id){
    thisId=id;
    task=tasks[id];
    builder="";
    builder+="<label>name:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='valname' type='text' value='"+task['name']+"'><br class='formbr'>";
    builder+="<label>description:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='valdescription' type='text' value='"+task['description']+"'><br class='formbr'>";
    builder+="<label>order:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='valorder' type='text' value='"+task['order']+"'><br class='formbr'>";
    builder+="<label>status:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='valstatus' type='text' value='"+statusName(task['status'])+"'><br class='formbr'>";
    builder+="<label>owner:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='valowner'>";
    for (i in users) {
        if (users[i].parent_id==null) {
            nameId=findUserName(users[i].id);
            builder+="<option value='"+users[i].id+"'";
            if (nameId==findUserName(task['owner'])) {
                builder+=" selected";
            }
            builder+=">"+nameId+"</option>";
        }
    }
    builder+="</select><br class='formbr'>";   
    
    builder+="<label>assigned_to:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='valassigned_to'>";
    for (i in users) {
        if (users[i].parent_id==$("#valowner").val()) {
            nameId=findUserName(users[i].id);
            builder+="<option value='"+users[i].id+"'";
            if (nameId==findUserName(task['assigned_to'])) {
                builder+=" selected";
            }
            builder+=">"+nameId+"</option>";
        }
    }
    builder+="</select><br class='formbr'>";

    builder+="<label>updated-at:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='valupdated_at' type='text' value='"+task['updated_at']+"'><br class='formbr'>"; 
    builder+="<button>Back</button><button>New Task</button><button type='submit'>Update</button>";
    $("#edittask").html(builder);
    mytoggle("#edittask","#formtable");
}

//--------------------------------------------------------------new task

function fNewTask(){
    var d=new Date();
    builder="";
    builder+="<label>name:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='newname' type='text' value=''><br class='formbr'>";
    builder+="<label>description:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='newdescription' type='text' value=''><br class='formbr'>";
    builder+="<label>order:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='neworder' type='text' value=''><br class='formbr'>";
    builder+="<label>status:</label>&nbsp;&nbsp;&nbsp;&nbsp;<input id='newstatus' type='text'><br class='formbr'>";
    builder+="<label>owner:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='newowner'>";
    builder+="<option value='title'>"+"choose"+"</option>";
    for (i in users) {
      if (users[i].parent_id==null) {  
        builder+="<option value='"+users[i].id+"'";
        builder+=">"+findUserName(users[i].id)+"</option>";
    }}
    builder+="</select><br class='formbr'>";
    builder+="<label>assigned_to:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='newassigned_to'>";
    builder+="<option value='title'>"+"choose"+"</option>";
    builder+="</select><br class='formbr'>";
    builder+="<input class='Ddate' type='text' id='newupdated_at' value='"+d.getDate()+"'>"; 
    builder+="<input class='Ddate' type='text' id='newcreated_at' value='"+d.getDate()+"'>";
    builder+="<button>Back</button><button>Save</button>";
    $("#newtask").html(builder);
    mytoggle("#newtask","#formtable");
}

//--------------------------------------------------------------formtable

function fcreateformtable() {
    build="";
    build+="<label>tasks that assigned_to:</label>&nbsp;&nbsp;&nbsp;&nbsp;<select id='selectassigned_to'>";
    for (i in users) {
        nameId=findUserName(users[i].id);
        build+="<option value='"+nameId+"'";
        if (i==1) {
            build+=" selected";
        }
        build+=">"+nameId+"</option>";
    }
    build+="</select><br class='formbr'>";
    build+="<button>Show all the tasks</button><br class='formbr'><button>New Task</button>";
    $("#formtable").append(build);
}

//--------------------------------------------------------------selecttable

function fselecttable(ida) {
        builder="<tr id='trtitle'><td>Task Name</td><td>Assigned To</td><td>Order</td><td>Owner</td><td>Status</td><td>Show</td><td>Edit</td><td>Delete</td></tr>";
        for (i in tasks) {
            AssignedTo=findUserName(tasks[i]["assigned_to"]);
            if (ida==AssignedTo)
            { 
                builder+='<tr id="'+tasks[i]["id"]+'">';
                builder+='<td>'+tasks[i]["name"]+'</td>';
                builder+='<td>'+AssignedTo+'</td>';
                builder+='<td>'+tasks[i]["order"]+'</td>';
                builder+='<td>'+findUserName(tasks[i]["owner"])+'</td>';
                builder+='<td>'+statusName(tasks[i]["status"])+'</td>';
                builder+='<td><button class="btnShow">Show</button></td>';
                builder+='<td><button class="btnEdit">Edit</button></td>';
                builder+='<td><button >Delete</button></td>';
                builder+='</tr>'+"\n";      
            }} 
        $("#table").html(builder);
}

//--------------------------------------------------------------build the table

function fCreateTable(tasks) {
    builder="<tr id='trtitle'><td>Task Name</td><td>Assigned To</td><td>Order</td><td>Owner</td><td>Status</td><td>Show</td><td>Edit</td><td>Delete</td></tr>";
    for (i in tasks) {
        builder+='<tr id="'+tasks[i]["id"]+'">';
        builder+='<td>'+tasks[i]["name"]+'</td>';
        builder+='<td>'+findUserName(tasks[i]["assigned_to"])+'</td>';
        builder+='<td>'+tasks[i]["order"]+'</td>';
        builder+='<td>'+findUserName(tasks[i]["owner"])+'</td>';
        builder+='<td>'+statusName(tasks[i]["status"])+'</td>';
        builder+='<td><button class="btnShow">Show</button></td>';
        builder+='<td><button class="btnEdit">Edit</button></td>';
        builder+='<td><button >Delete</button></td>';
        builder+='</tr>'+"\n";    
    } 
    $("#table").html(builder);
}

//--------------------------------------------------------------start

function start() {
    $.ajax({
    url: "/tasks",
    type: "GET",
    dataType: 'json',
    success: function(arr){
        tasks=arr[0];
        users=arr[1];
        fcreateformtable();
        fCreateTable(tasks);
        }        
    });   
}

//--------------------------------------------------------------submit

$("#form").submit(function(e){
    e.preventDefault();  
    })
//--------------------------------------------------------------end
});