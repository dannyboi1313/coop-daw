export const getSolidColor = (color) => {
  switch (color) {
    case "blue":
      return "rgb(73, 86, 151)";
    case "pink":
      return "rgb(192, 85, 119)";
    case "yellow":
      return "rgb(206, 208, 92)";
    default:
      return "";
  }
};

export const getTransparentColor = (color) => {
  switch (color) {
    case "blue":
      return "rgba(73, 86, 151, 0.6)";
    case "pink":
      return "rgba(192, 85, 119, 0.6)";
    case "yellow":
      return "rgba(206, 208, 92,0.6)";
    default:
      return "";
  }
};
