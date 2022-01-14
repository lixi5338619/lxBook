function test() {
  for (var index = 0; index != 5;) {
    switch (index) {
      case 0:
        console.log("This is case-block 0");
        index = 3;
        continue;

      case 1:
        console.log("This is case-block 1");
        return;
        index = 5;
        continue;

      case 2:
        console.log("This is case-block 2");
        index = 1;
        continue;

      case 3:
        console.log("This is case-block 3");
        index = 4;
        continue;

      case 4:
        console.log("This is case-block 4");
        index = 2;
        continue;
    }
    break;
  }
}