// It contains the logic of CRUD
// var obj = {key:value, key:value}
const todoOperations = {
    // addTask : function(){

    // }
    tasks:[], 
    getTotal(){
        return this.tasks.length;
    },
    addTask(task){
        this.tasks.push(task);
    },
    getMarkedCount() {
        return this.tasks.filter(task => task.isMarked).length;
    },
    toggleMark(id){
        const task = this.tasks.find(task => task.id == id);
        if(task){
            task.isMarked = !task.isMarked;
        }
    },
    deleteMarked(){
        this.tasks = this.tasks.filter(task => !task.isMarked);
    },
    getAllTasks(){
        return this.tasks;
    },

    removeTask(){
       
    },
    getTask(id){
        return this.tasks.find(task => task.id == id);
    },


    searchTask(keyword){
        keyword = keyword.toLowerCase();
        return this.tasks.filter(task => 
            task.id.toString().includes(keyword) || 
            task.name.toLowerCase().includes(keyword)
        );
    },
    updateTask(id, updatedTask){
        const index = this.tasks.findIndex(task => task.id == id);
        if(index !== -1){
            this.tasks[index] = { ...updatedTask, id };  // Preserve original ID
        }
    },
    sortBy(field, ascending = true){
        return [...this.tasks].sort((a, b) => {
            let aVal = a[field];
            let bVal = b[field];

            // Convert to numbers if sorting by ID
            if (field === 'id') {
                aVal = parseInt(aVal);
                bVal = parseInt(bVal);
            }
            else if (field === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            else {
                aVal = aVal.toString().toLowerCase();
                bVal = bVal.toString().toLowerCase();
            }

            let result = (aVal > bVal) ? 1 : (aVal < bVal) ? -1 : 0;
            return ascending ? result : -result;
        });
    },

    clearAll(){
        this.tasks = [];
    },
    toggleMark(id){
        const task = this.tasks.find(task => task.id == id);
        if(task){
            task.isMarked = !task.isMarked;
        }
    },
    getMarkedCount(){
        return this.tasks.filter(task => task.isMarked).length;
    },
    getUnmarkedCount(){
        return this.tasks.length - this.getMarkedCount();
    }

}
export default todoOperations;
