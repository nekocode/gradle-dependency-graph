
The `${lastest-version}` of this plugin is [![](https://jitpack.io/v/nekocode/DepAnPlugin.svg)](https://jitpack.io/#nekocode/DepAnPlugin). Copy below code to the `build.gradle` of your android application project.

```gradle
buildscript {
    repositories {
        maven { url "https://jitpack.io" }
    }
    dependencies {
        classpath "com.github.nekocode:DepAnPlugin:${lastest-verion}"
    }
}

apply plugin: "dep-extract"
 
//extractDep {
//    outputFile = project.rootProject.file("dep.json")
//    nodeFilter = { nodeName -> true }
//    edgeFilter = { sourceNodeName, targetNodeName -> true }
//}
```

Now, you can extract the dependency graph of corresponding buildType into a json file by running gradle task `extractDep${buildType}` (such as `extractDepRelease`).

Visualize:

Rename the the output json file to `data.json` and copy it to the project [gradle-dep-graph-react](https://github.com/gradle-dep-graph/gradle-dep-graph-react)'s `public` directory. Then build and run this react project.

The final effect is like: [gradle-dep-graph.github.io](https://gradle-dep-graph.github.io)
