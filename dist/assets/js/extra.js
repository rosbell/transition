function updateTextArea() {
  var allVals = [];
  const checkboxes = document.querySelectorAll(
    ".custom-checkbox__input:checked"
  );
  allVals.push(...checkboxes);


  allVals = allVals.map((el) => {
    return el.defaultValue;
  });

  let makeList = document.querySelector("#sideArea");
  let copyList =
    "<ol>" +
    allVals
      .map((element) => {
        return "<li>" + element + "</li>";
      })
      .join("") +
    "</ol>";

  makeList.innerHTML = copyList;
  navigator.clipboard.writeText(copyList);

  let emailList =
    "%0a" +
    allVals
      .map((element) => {
        return "%09" + "* " + element;
      })
      .join("%0a");

  //add link to page
  //for each line link + element +
  let resourceLink = "http://www.manchester.ac.uk";
  document.getElementById("emailMe").onclick = () => {
    location.href = `mailto:?body=${emailList}` + "%0a" + resourceLink;
  };
  // allVals.forEach((element) => {
  //   document.querySelector("sideArea").appendChild();
  // });
  // // allVals.push(checked.value)
  // //foreach push allvals
  // //allvals to sidediv)

  // console.log(checkboxes.values);
  // // console.log(allVals);
}
document.querySelectorAll(".contentList input").forEach((element) => {
  element.onclick = updateTextArea;
});

//   $(".contentList :checked").each(function (i) {
//     allVals.push((i != 0 ? "\r\n" : "") + $(this).val());
//   });
//   document.getElementById("sideArea").textContent = allVals;
// }

// $(function () {
//   $(".contentList input").click(updateTextArea);
//   updateTextArea();
// });

var button = document.getElementById("copyID"),
  input = document.getElementById("toDoLater");

button.addEventListener("click", function (event) {
  event.preventDefault();
  navigator.clipboard.writeText(input.value);
});

// $(function () {
//   $("#yourCheckBox").click(function () {
//     if ($(this).is(":checked")) {
//       $("#showHideDiv").show();
//     } else {
//       $("#showHideDiv").hide();
//     }
//   });
// });

//text thatyou want in the email
// don't copy to clipboard
//link where href is `mailto:?subject=thing&body=${input.value}`
//create a tag
//add href
///create a.tick method on the a tag
//

//ALTernative
//
// function updateTextArea() {
//   var allVals = [];
//   $(".contentList :checked").each(function (i) {
//     allVals.push((i != 0 ? "\r\n" : "") + $(this).val());
//   });
//   $("#toDoLater").val(allVals).attr("rows", allVals.length);
// }
// $(function () {
//   $(".contentList input").click(updateTextArea);
//   updateTextArea();
// });
