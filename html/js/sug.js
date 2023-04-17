/*搜索建议*/
if (typeof openSug === "function" && document.getElementById("search_box") != null) openSug("search_box", {
  //注释的项已在css中定义
  bgcolor: "#eff6fe",
  //bgcolorHI : "#e0efda",
  borderColor: "",
  fontColor: "",
  //fontColorHI : "#458bdc",
  fontFamily: "Montserrat,sans-serif",
  fontSize: "14px",
  padding: "6px 25px",
  radius: "10px",
  shadow: "rgb(0 0 0 / 50%) 0px 6px 10px",
  source: "kugou",
  sugSubmit: true,
  width: "",
  XOffset: "",
  YOffset: "-4"
}, function () {
});