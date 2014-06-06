var ENTER_KEY = 13;
var ESCAPE_KEY = 27;
var Non_Bank_Space = "";
var listCount = 0;
var completedCount = 0;
var actions = [];

$(document).ready(function() {
   var App = {
      init: function() {
         console.log("enter App.init");  
         setListeners();
         retrieveLocal("todos");
         listCount = 0;
         completedCount = 0;
         if ( actions.length ) {
            filterButtonAll(($("#filterButtonAll")));
         }
         $("#new-todo").focus;
      },
   };

   function saveLocal(nameSpace) {
      console.log("enter saveLocal:");
      var memStorageAsString = JSON.stringify(actions);
      console.log("   memStorageAsString: "+memStorageAsString);
      localStorage.setItem(nameSpace, memStorageAsString);
   };

   function retrieveLocal(nameSpace) {
      console.log("enter retrieveLocal:");
      var memStorageAsString = localStorage.getItem(nameSpace);
      console.log("   memStorageAsString: "+memStorageAsString);
      actions = JSON.parse(memStorageAsString) || [];
   };

   function addToStorage(actionItem) {
      console.log("enter addToStorage");
      actions.push(actionItem);
      saveLocal("todos");
   };

   function markCompleteInStorage(actionItem) {
      console.log("enter markCompleteInStorage");
      for (var i=0; i<actions.length; i++) {
         if ( actions[i].id === actionItem.id ) {
            actions[i].complete = actionItem.complete;
         }
      }
      saveLocal("todos");
   };

   function removeFromStorage(actionItem) {
      console.log("enter removeFromStorage");
   };

   function findInStorage(actionItem) {
      console.log("enter findInStorage");

   };

   function uuid() {
      var i, random;
      var uuid = "";
      for (i = 0; i < 32; i++) {
         random = Math.random() * 16 | 0;
         if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += "-";
         }
         uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
      }
      return uuid;
   };

   function updateListCount (countArg) {
      // update number of items in the list
      console.log("entered updateListCount"+countArg?countArg:listCount);
      if ( countArg) {
         listCount = countArg;
      } else {
         listCount += 1;
      }
      console.log("   Count: "+completedCount);
      $("#listCount").text(listCount);
      if (listCount === 1) {
         $("#listCountDescription").text(" todo item");
         $("#filterButtonAll").css({"font-weight":"bold"});
      } else {
         $("#listCountDescription").text(" todo items");
      };
   };

   function updateCompletedCount(countArg) {
      console.log("entered updateCompletedCount");
      if ( countArg ) {
         completedCount = countArg;
      } else {
         completedCount += 1;
      }
      console.log("   Completed: "+completedCount);
      $("#completedCount").text(completedCount); 
   };

   function addtoList(addItem) {
      var action = {
                    id: uuid(),
                    complete: false,
                    description: addItem,
                   };
      console.log("enter addtoList");
      var actionString = JSON.stringify(action);
      console.log("   do: "+actionString);
      addToStorage(action);
// add todo item to list
      $("#listTemplate li").clone(true).appendTo("#theList");
      $("#theList li").last().find(".listItem").text(action.description);
      $("#theList li").last().find(".itemID").text(action.id);
// update number of items in the list
      updateListCount();
// give the action object back to the caller
      return action;
   };

   function markDone(doneItem) {
      var action = {
                    id: doneItem.find(".itemID").text(),
                    complete: true,
                    description: doneItem.find(".listItem").text(),
                   };
      console.log("enter markDone: ");
      console.log("   Mark as complete:"+action.description );
// mark todo item complete in list
      doneItem.find(".itemID").text();
      doneItem.find(".itemCheckOff").css({"text-decoration":"line-through"});
      doneItem.find(".listItem").css({"text-decoration":"line-through"});
// increment and display complete count
      updateCompletedCount();
      console.log("   Completed Count: "+completedCount);     
// mark todo item complete in storage
      markCompleteInStorage(action);
   };

   function removeAllCompleted() {
      console.log("enter removeAllCompleted");
      var newActions = [];
      for ( var i=0; i<actions.length; i++ ) {
         if ( !actions[i].complete ) {
            newActions.push(actions[i]);
         }
      };
      actions = newActions;
      displayAllToDoes();
      updateListCount(actions.length);
      updateCompletedCount(0);
   };

   function clearToDoList() {
      console.log("enter clearToDoList");
      listCount = 0;
      completedCount = 0;
      $("#theList li").remove();
   };

   function removeAnItem(iD) {
      console.log("enter removeAnItem id: "+iD);
      for (var i=0; i<actions.length; i++) {
         if ( actions[i].id === iD ){  // need to delete this one
            for ( var j=i; j<actions.length-1; j++ ) {
               actions[j] = actions[j+1];     // move successive items down one
            }
            actions.pop();      // then pop the last one
            completedCount -= 1;
         }
      };
      console.log("leaving removeAnItem actions.length: "+actions.length);
      console.log("leaving removeAnItem completedCount: "+completedCount);
   };

   function displayAllToDoes() {
      console.log("enter displayAllToDoes");
      clearToDoList();
      for (var i=0; i<actions.length; i++) {
         var action = actions[i];
         $("#listTemplate li").clone(true).appendTo("#theList");
         $("#theList li").last().find(".itemID").text(action.id);
         $("#theList li").last().find(".complete").text(action.complete);
         $("#theList li").last().find(".listItem").text(action.description);
         if (action.complete) {
            $("#theList li").last().find(".itemCheckOff").css({"text-decoration":"line-through"});
            $("#theList li").last().find(".listItem").css({"text-decoration":"line-through"});
            console.log("   found a completed todo");
            updateCompletedCount(completedCount);
         };
      };
   };

   function displayActiveToDoes() {
      clearToDoList();
      for (var i=0; i<actions.length; i++) {
         var action = actions[i];
         if ( !action.complete ) {
            $("#listTemplate li").clone(true).appendTo("#theList");
            $("#theList li").last().find(".itemID").text(action.id);
            $("#theList li").last().find(".complete").text(action.complete);
            $("#theList li").last().find(".listItem").text(action.description);
         };
      };
   };

   function displayCompletedToDoes() {
      clearToDoList();
      for (var i=0; i<actions.length; i++) {
         var action = actions[i];
         if (action.complete) {
            $("#listTemplate li").clone(true).appendTo("#theList");
            $("#theList li").last().find(".itemID").text(action.id);
            $("#theList li").last().find(".complete").text(action.complete);
            $("#theList li").last().find(".listItem").text(action.description);
// show complete
            $("#theList li").last().find(".itemCheckOff").css({"text-decoration":"line-through"});
            $("#theList li").last().find(".listItem").css({"text-decoration":"line-through"});
         };
      };
   };

   function filterButtonAll(btn) {
      console.log("enter filterButtonAll");
      btn.css({"font-weight":"bold"});
      $("#filterButtonActive").css({"font-weight":"normal"});
      $("#filterButtonCompleted").css({"font-weight":"normal"});
      displayAllToDoes();
      updateListCount(actions.length);
   };

   function filterButtonActive(btn) {
      btn.css({"font-weight":"bold"});
      $("#filterButtonAll").css({"font-weight":"normal"});
      $("#filterButtonCompleted").css({"font-weight":"normal"});
      displayActiveToDoes();
   };

   function filterButtonCompleted(btn) {
      btn.css({"font-weight":"bold"});
      $("#filterButtonAll").css({"font-weight":"normal"});
      $("#filterButtonActive").css({"font-weight":"normal"});
      displayCompletedToDoes();
   };

   function setListeners() {
      $("#new-todo").on("keypress",function(evt) {
//         console.log("key selected: "+evt.which);
         if (evt.which == ENTER_KEY) {
            console.log("clicked enter_key in #new-todo");
            addtoList($("input:text").val());
            $("input:text").val("");
         } else if (evt.which == ESCAPE_KEY) {
            console.log("clicked escape_key in #new-todo");
         } else {
            console.log("clicked some key");
         };
      });
      $("#listChevron").on("hover",function() {
         console.log("listChevron hover in #listChevron");
         this.background("silver");
      });
      $("#listChevron").on("click",function() {
         console.log("listChevron click in listChevron");
      });
/*      $("listEditable").on("",function() {});
      $("theListDisplay").on("",function() {});
      $("theList").on("",function() {});
      $("anItem").on("",function() {});               */
      $(".itemCheckOff").on("mouseenter",function() {
         $(this).css({"background-color":"#CDCDCD"});
      });
      $(".itemCheckOff").on("mouseleave",function() {
         $(this).css({"background-color":"white"});
      });
      $(".itemCheckOff").on("click",function() {
         markDone($(this).parent());
      });
/*      $("listItem").on("",function() {});
      $("clearFloat").on("",function() {});
      $("counterBar").on("",function() {});
      $("countDiv").on("",function() {});
      $("listCount").on("",function() {});
      $("displayFilter").on("",function() {});        */

      $(".removeItem").on("mouseenter", function() {
         console.log("removeItem begin hover");
         Non_Bank_Space = $(this).text();
         $(this).text("x");
      });
      $(".removeItem").on("mouseleave", function() {
         console.log("removeItem end hover");
         $(this).text(Non_Bank_Space);
      });
      $(".removeItem").on("click", function() {
         console.log("removeItem click");
//         var id = $(this).parent().find(".itemID").text();
//         console.log("   itemID: "+id);
         removeAnItem($(this).parent().find(".itemID").text());
         displayAllToDoes();
         updateCompletedCount(completedCount);
      });

      $(".filterButton").on("mouseenter",function() {
         console.log("filterButton begin hover");
         $(this).css({"background-color":"white"});
      });
      $(".filterButton").on("mouseleave",function() {
         console.log("filterButton end hover");
         $(this).css({"background-color":"#CDCDCD"});
      });
      $("#filterButtonAll").on("click",function() {
         filterButtonAll($(this));
         $(this).css({"font-weight":"bold"});
         $("#filterButtonActive").css({"font-weight":"normal"});
         $("#filterButtonCompleted").css({"font-weight":"normal"});
         displayAllToDoes();
      });

      $("#filterButtonActive").on("click",function() {
         filterButtonActive($(this));
         $(this).css({"font-weight":"bold"});
         $("#filterButtonAll").css({"font-weight":"normal"});
         $("#filterButtonCompleted").css({"font-weight":"normal"});
         displayActiveToDoes();
      });

      $("#filterButtonCompleted").on("click",function() {
         filterButtonCompleted($(this));
         $(this).css({"font-weight":"bold"});
         $("#filterButtonAll").css({"font-weight":"normal"});
         $("#filterButtonActive").css({"font-weight":"normal"});
         displayCompletedToDoes();
      });
         
      $("#removeCompleted").on("mouseenter",function() {
         console.log("removeCompleted mouseenter");
         $(this).css({"background-color":"white"});
      });
      $("#removeCompleted").on("mouseleave",function() {
         console.log("removeCompleted mouseleave");
         $(this).css({"background-color":"buttonface"});
      });
      $("#removeCompleted").on("click",function() {
         console.log("removeCompleted clicked");
         removeAllCompleted();
      });
  
   };
   
   App.init();
});