class Boy {
  @speak('中文')
  run() {
    console.log('i can speak' + this.language)
  }
}

function speak(language) {
  return (target, name, descriptor) => {
    console.log(target)
    console.log(name)
    console.log(descriptor)
    target.language = language
  }
}

const luke = new Boy()

luke.run()