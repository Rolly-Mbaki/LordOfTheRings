const openModals = document.querySelectorAll('.open-button');
const closeModal = document.querySelector('.close-button');
const modal = document.querySelector('#modal');

openModals.forEach((openModal) => {
    openModal.addEventListener('click', () =>{
        modal.showModal();
        const input = document.getElementById("myReason")
        input.value = ""
    })
})

closeModal.addEventListener('click', () =>{
    modal.close();
})