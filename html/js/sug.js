/*搜索建议*/
if (typeof openSug === "function" && document.getElementById("search_box") != null) openSug("search_box", {
  //注释的项已在css中定义
  bgcolor: "#fefeff",
  bgcolorHI : "#e3e5e7",
  borderColor: "",
  fontColor: "",
  //fontColorHI : "#458bdc",
  fontFamily: "Montserrat,sans-serif",
  fontSize: "14px",
  padding: "10px 10px",
  radius: "10px",
  shadow: "rgb(0 0 0 / 50%) 0px 6px 10px",
  source: "kugou",
  sugSubmit: true,
  width: "",
  XOffset: "7",
  YOffset: "5"
}, function () {
});