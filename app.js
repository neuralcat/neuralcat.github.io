u=''; let e=s=>u=s,peek=(...a)=>{let s=u,n=k(...a);return e(s),n},k=(f,...a)=>{let s=u;try{return f(...a)}catch{e(s)}},c=n=>{let v=n.filter(e=>e).pop();u=u.slice(v.length);return v};aprils={feed:e,peek,skip:k,match:r=>{if(m=u.match(r))return c(m);throw''}}


const { feed, skip, match } = aprils


function fail() {
  throw 'syntax error'
}


function some(a, p, b, c) {
  let node = []
  a()

  while (!skip(c)) skip(b, node.push(p()))
  return node
}


const normal_namere = ['h1', 'h2', 'h3', 'p', 'ul', 'li', 'a', 'div', 'br', 'hr'].join('|')


function langle() {
  return match(/^</)
}


function rangle() {
  return match(/^>/)
}


function text() {
  return match(/^[^<>]*/)
}


function attribute() {
  return match(/^\s*[a-zA-Z0-9]+="[^"]+"/)
}


function attributes() {
  list = []

  while (! peek(rangle)) {
    skip(match, /^\s+/) 
    list.push(attribute())
  }

  return list
}


function start(namere) {
  langle()
  let name = match(new RegExp(namere || normal_namere))

  attributes()
  rangle()

  return name
}


function node(parent) {
  let name = start()

  if (name == 'br' || name == 'hr') {
    return {
      name,
      children: [],
    }
  }

  if (name == "p" || name == "div") {
    if (parent == "p") fail()
  }

  children = nodes(name)
  terminate(name)

  return {
    name,
    children
  }
}


function terminate(name) {
  return match(new RegExp(`^</${name}>`))
}


function nodes(parent) {
  let list = []

  while (! peek(terminate, parent)) {
    list.push(skip(node, parent) || text())
  }

  return list
}


function head() {
  start('head')
  let t = skip(title)
  terminate('head')

  return t
}


function title() {
  start('title')
  let t = text()
  terminate('title')

  return t
}


function body() {
  start('body')
  let n = nodes('body')
  terminate('body')
  return n
}


function html() {
  start('html')
  let t = head()
  let b = body()
  terminate('html')

  return {
    title: t,
    body: b
  }
}

function parse(markup) {
  feed(markup
    .replaceAll(/\s+</g, '<')
    .replaceAll(/>\s+/g, '>')
  )
  try {
    html()
    return true
  } catch {
    return false
  }
}

