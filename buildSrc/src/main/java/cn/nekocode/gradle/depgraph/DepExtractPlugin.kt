/*
 * Copyright 2018. nekocode (nekocode.cn@gmail.com)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.nekocode.gradle.depgraph

import com.google.common.io.Files
import groovy.json.JsonOutput
import org.gradle.api.Plugin
import org.gradle.api.Project
import org.gradle.api.artifacts.ResolvedDependency
import java.io.File

/**
 * @author nekocode (nekocode.cn@gmail.com)
 */
class DepExtractPlugin : Plugin<Project> {
    companion object {
        const val ASSEMBLE_TASK_PREFIX = "assemble"
    }

    override fun apply(project: Project) {
        project.extensions.create("extractDep", DepExtractConfig::class.java)

        project.afterEvaluate { _ ->
            val buildTypes = ArrayList<String>()

            for (task in project.tasks) {
                if (!task.name.startsWith(ASSEMBLE_TASK_PREFIX)) {
                    continue
                }
                val buildType = task.name.substring(ASSEMBLE_TASK_PREFIX.length)
                if (buildType.isEmpty()) {
                    continue
                }

                buildTypes.add(buildType)
            }

            for (buildType in buildTypes) {
                createGraphTask(project, buildType)
            }
        }
    }

    private fun createGraphTask(project: Project, buildType: String) {
        val pluginConfig = project.extensions.getByType(DepExtractConfig::class.java)

        project.tasks.create("extractDep$buildType") {
            it.group = "reporting"

            it.doFirst {
                val buildTypeLowerCase = buildType[0].toLowerCase() + buildType.substring(1)
                val targetConfigs = arrayOf(
                        "${buildTypeLowerCase}CompileClasspath",
                        "${buildTypeLowerCase}RuntimeClasspath"
                )

                val nodes = HashSet<Map<String, String>>()
                val edges = HashSet<Map<String, String>>()

                val projectNode = "${project.group}.${project.name}"

                project.configurations.filter { config ->
                    config.isCanBeResolved && (config.name in targetConfigs)
                }.flatMap { config ->
                    project.logger.lifecycle(config.name)
                    config.resolvedConfiguration.firstLevelModuleDependencies
                }.forEach { dep ->
                    addEdges(projectNode, dep, nodes, edges, pluginConfig)
                }

                val outputFile = pluginConfig.outputFile
                        ?: File(project.rootDir, "dep-$buildTypeLowerCase.json")
                Files.createParentDirs(outputFile)
                val json = JsonOutput.toJson(mapOf(
                        "nodes" to nodes,
                        "edges" to edges
                ))
                outputFile.writeText(json)
            }
        }
    }

    private fun addEdges(parentNode: String, dependency: ResolvedDependency,
                         nodes: HashSet<Map<String, String>>, edges: HashSet<Map<String, String>>,
                         config: DepExtractConfig) {
        val childNode = "${dependency.moduleGroup}.${dependency.moduleName}"
        if (!config.nodeFilter(parentNode) || !config.nodeFilter(childNode)) {
            return
        }
        nodes.add(mapOf(
                "id" to parentNode,
                "name" to parentNode.substring(parentNode.lastIndexOf(".") + 1)
        ))
        nodes.add(mapOf(
                "id" to childNode,
                "name" to dependency.moduleName
        ))
        if (config.edgeFilter(parentNode, childNode)) {
            edges.add(mapOf(
                    "source" to parentNode,
                    "target" to childNode
            ))
        }

        dependency.children.forEach {
            addEdges(childNode, it, nodes, edges, config)
        }
    }
}
