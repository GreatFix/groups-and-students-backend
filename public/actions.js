const pageID = document.querySelector("ul").id

const $ul = document.querySelector( `#${pageID}` )
$ul.addEventListener("click", (event)=>{
    switch(event.target.classList[0]){        
        case 'inputActive': active(event);  break
        case 'buttonAdd':   add(event);     break
        case 'buttonEdit':  edit(event);    break
        case 'buttonDel':   remove(event);  break
    }
})

function addListener(id){
    const $form = document.querySelector(`form[id='${id}']`)
        $form.addEventListener('submit', (event) => {
            event.preventDefault()
            let formData = new FormData(event.target)
            formData = Object.fromEntries(formData)
            if(event.target.classList.contains('editForm')){
                query(`${document.location.pathname}/${formData.id}`, "PUT", formData)
                    .then((response) => console.log(response))
                    .catch((err) => console.error(err))
            }
            else if(event.target.classList.contains('addForm')){
                query(`${document.location.pathname}`, "POST", formData)
                    .then((response) => console.log(response))
                    .catch((err) => console.error(err))
            }
            else if(event.target.classList.contains('outputForm')){
                query(`${document.location.pathname}/${formData.id}`, "DELETE")
                    .then((response) => console.log(response))
                    .catch((err) => console.error(err))
            }

        })
}

function active(event){
        let $input = event.target
        $input.classList.toggle('color-passive')
        $input.classList.toggle('color-active')
        
        if(pageID==='groups'){        
            const $form = document.querySelector(`form[id='${$input.id}']`)
            if(!$form.classList.contains('editForm')){
                let table = document.querySelector( `table[id='${$input.id}']`)
                if(table)
                    table.classList.toggle('hide')
            }
        }
}

function edit(event){
    let $form = document.querySelector( `form[id='${event.target.id}']`)

    let save = $form.querySelector(`button.buttonEdit`)
    save.parentNode.classList.toggle('hide')
    let edit =$form.querySelector(`button.buttonSave`)
    edit.parentNode.classList.toggle('hide')

    inputs = $form.querySelectorAll( `input`)
    inputs.forEach(input => input.disabled="")

    $form.classList.add('editForm')
    addListener(`${event.target.id}`)

}

function remove(event){
    let button = event.target
    button.id==="cancel" ? window.location.reload() : addListener(`${button.id}`)
}

function add(event){
    let li = event.target.parentNode
    event.target.remove()
    if(pageID==='groups'){        
        li.insertAdjacentHTML('afterbegin',
        `
            <form id="addForm${event.target.id}" class="addForm">
                <div class="d-flex row justify-content-between">
                    <div class="col-8">    
                        <input class='form-control' type="text" name="name" placeholder="Enter the name of the group ..">
                    </div>
                    <div class="col-sm-2">
                        <button type="submit" class="form-control btn-success buttonSubmit">&#10004;</button>
                    </div>
                    <div class="col-sm-2">
                        <button id="cancel" type="button"  class="buttonDel form-control btn-danger ">&#10006;</button>
                    </div>
                </div>
            </form>
        `
        )
    }
    else if(pageID==='students'){
        li.insertAdjacentHTML('afterbegin',
        `
            <form id="addForm${event.target.id}" class="addForm d-flex row justify-content-between">
                <div class="col-3">
                    <input name="lastName" class="inputActive form-control text-light text-center color-passive">            
                    </input>
                </div>
                <div class="col-3">
                    <input name="firstName" class="inputActive form-control text-light text-center color-passive">            
                    </input>
                </div>

                <div class="col-2">
                    <input name="groupId" class="inputActive form-control text-light text-center color-passive">            
                    </input>
                </div>
                <div class="col-sm-2">
                <button type="submit" class="form-control btn-success buttonSubmit">&#10004;</button>
                </div>
                <div class="col-sm-2">
                    <button id="cancel" type="button"  class="buttonDel form-control btn-danger ">&#10006;</button>
                </div>
            </form>
        `
        )
    }
        
    addListener(`addForm${event.target.id}`)
}

function query(url, method, body){ 
    const headers = {
        'Content-Type': 'application/json'
    }
    
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body) 
    }).then(setTimeout(()=> window.location.reload(),50))
}