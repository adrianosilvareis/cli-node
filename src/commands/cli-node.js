const command = {
  name: 'cli-node',
  run: async toolbox => {
    const { print, system, parameters, filesystem } = toolbox
    
    const repo = parameters.first
    const options = parameters.options
    
    if(!repo) {
      print.error('project name must be specified')
      return
    }

    print.info('baixando repositorio...')
    await system.exec(`git clone https://github.com/adrianosilvareis/node_api_boilerplate ${repo}`)
    await filesystem.remove(`./${repo}/.git`)

    print.info('resolvendo coisas pendentes...')
    
    const path = `./${repo}/package.json`
    const package = filesystem.read(path, 'json')
    package.name = repo
    await filesystem.write(path, package)

    print.info('iniciando git...')
    await system.run(`cd ${repo} && git init && git add * && git commit -m "${options.m || 'fist commit'}"`)

    print.info('baixando dependencias...')

    const yarn = toolbox.system.which('yarn')
    const command = yarn ? 'yarn' : 'npm'

    print.success(`Created project ${repo}`)
    print.success(`cd ${repo}`)
    print.success(`${command} install`)
    print.success(`${command} start`)
  }
}

module.exports = command
