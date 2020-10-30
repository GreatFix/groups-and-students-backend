const pageID = document.querySelector("ul").id

const $ul = document.querySelector( `#${pageID}` )
$ul.addEventListener("click", (event)=>{
    switch(event.target.classList[0]){        
        case 'labelActive': active(event);  break
        case 'buttonAdd':   add(event);     break
        case 'buttonDel':   remove(event);  break
        case 'buttonEdit':  edit(event);    break
    }
})

function addListener(id){
    const $form = document.querySelector(`#${id}`)
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

        })
}

function active(event){
        let label = event.target
        label.classList.toggle('color-passive')
        label.classList.toggle('color-active')

        let table = document.querySelector( `table[id='${label.id}']`)
        table.classList.toggle('hide')
}
function add(event){
    let li = event.target.parentNode
    event.target.remove()

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
                    <button id="${li.id}" type="button"  class=" form-control btn-danger buttonDel">&#10006;</button>
                </div>
            </div>
        </form>
    `
    )
    
    addListener(`addForm${event.target.id}`)

}
function edit(event){
    let li = document.querySelector( `li[id='${event.target.id}']`)

    while (li.firstChild) {
        li.removeChild(li.firstChild);
    }

    li.insertAdjacentHTML('afterbegin',
    `
        <form id="editForm${event.target.id}" class="editForm">
            <div class="d-flex row justify-content-between">
                <div class="col-10">    
                    <input class='form-control' type="text" name="name" placeholder="Введите название группы..">
                </div>
                    <input type="hidden" class='form-control' type="text" name="id" value="${li.id}" placeholder="Identifier">
                <div class="col-2">
                    <button type="submit" class="form-control btn-success buttonSubmit">&#10004;</button>
                </div>
            </div>
        </form>
    `
    )

    addListener(`editForm${event.target.id}`)

}

function remove(event){
    let button = event.target
    button.id==="inputLi" ? window.location.reload() : query(`${document.location.pathname}/${button.id}`, "DELETE")
}

function query(url, method, body){ 
    const headers = {
        'Content-Type': 'application/json'
    }
    
    return fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body) 
    }).then(setTimeout(()=> window.location.reload(), 10))
}