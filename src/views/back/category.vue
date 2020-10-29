<template>
<back>

    <template>
  <v-expansion-panels>
    <v-expansion-panel
    >
      <v-expansion-panel-header>
        filter
      </v-expansion-panel-header>
      <v-expansion-panel-content>
      <v-row>
        <v-col
          cols="12"
          md="2">
           <v-select
          :items="filters"
          label="Search column"
          v-model="params.search_column"
          outlined
        ></v-select>
        </v-col>
        <v-col
          cols="12"
          md="4">
           <v-select
          :items="operators"
          label="Search Operator"
          v-model="params.search_operator"
          outlined
        ></v-select>
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            v-model="params.search_query_1"
            label="Search query"
            required
            @keyup.enter="GetData"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="2" v-if="params.search_operator === 'between'">
          <v-text-field
            v-model="params.search_query_2"
            label="Search query 2"
            @keyup.enter="GetData"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="2"
        >
         <v-btn class="ma-2" 
      depressed
      color="success"
      @click="GetData"
    >
      Search
    </v-btn>
         <v-btn class="ma-2" 
      depressed
      color="primary"
      @click="resetFilter"
    >
      Reset
    </v-btn>
        </v-col>
      </v-row></v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
    </template>
  <v-data-table
    :headers="headers"
    :items="items"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="800px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="name"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="6"
                  >
                    <v-text-field
                      v-model="editedItem.title"
                      label="title"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                      class="d-flex"
                      cols="12"
                      sm="6"
                    >
                      <v-select
                        :items="cats"
                        label="Standard"
                      ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="12"
                  >
                 <v-textarea
                v-model="editedItem.description"
                filled
                label="Description"
                auto-grow
                value="Description"
                ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save()"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="800px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete {{editedItem.name}} ?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="red darken-1" text @click="Remove(editedItem.ID)">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="GetData"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</back>
</template>
<script>
import back from '../../layouts/back'
 import axios from '../../axios'
  export default {
      components:{
          back
      },
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Title', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      items: [],
      cats:[],
      editedIndex: -1,
      init:'api/categorys/view',
      redirect: '/categorys',
      store: 'api/categorys',
       showFilter: false,
            params:{ 
                column: 'ID',
                direction: 'desc',
                itemsPerPage:10,
                page:1,
                search_column: 'id',
                search_operator: 'like',
                search_query_1:'all',
                search_query_2: ''
        },

        filters:[
            'ID', 'name', 'title', 'description'
        ],
        operators:['like'],
      editedItem: {
        name: '',
        title: '',
        description: '',
      },
      defaultItem: {
        name: '',
        title: '',
        description: '',
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.GetData()
      this.fetchData()
    },

    methods: {
        resetFilter(){
            this.params.column = 'ID',
            this.params.direction = 'desc',
            this.params.itemsPerPage=10,
            this.params.page=1,
            this.params.search_column= 'name',
            this.params.search_operator= 'like',
            this.params.search_query_1='all',
            this.params.search_query_2=''
            this.GetData()
        },
          
     async fetchData(){
        try{
            // console.log(token)
           const {data} = await axios.get(`${this.init}`)
            this.cats = data  

            console.log(cats)
        }catch(err){
           console.log(err)
        }
    },
      async GetData(){
        try{
          let p = this.params
            // console.log(token)
           const {data} = await axios.get(`${this.store}?column=${p.column}&direction=${p.direction}&per_page=${p.itemsPerPage}&page=${p.page}&search_column=${p.search_column}&search_operator=${p.search_operator}&search_query_1=${p.search_query_1}&search_query_2=${p.search_query_2}`)
            this.items = data  

            console.log(data)
        }catch(err){
           console.log(err)
        }
    },   
     async fetchData(){
        try{
            // console.log(token)
           const {data} = await axios.get(`${this.init}`)
            this.cats = data

            console.log(cats)
        }catch(err){
           console.log(err)
        }
    },  
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        // this.update(this.editedItem)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.items.splice(this.editedIndex, 1)
        this.Remove(this.e)
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

  async Remove(id){
     try{
          await axios.delete(`${this.store}/${id}`)
                this.GetData()
              this.close()
          
       }catch(err){
         this.snackbar = true
          console.log(err)
        this.errs = err.response.data
       }
    },
    async save(){
      if (this.editedItem.ID){
          try{
            console.log(this.editedItem.ID)
                    const response = await axios.put(`${this.store}/${this.editedItem.ID}`, {
                          name: this.editedItem.name,
                          title: this.editedItem.title,
                          description: this.editedItem.description,
                      })
                      if(response.status === 200){
                        this.GetData()
                        this.close()
                      }
                }catch(err){
                  this.snackbar = true
                  this.errs = err.response.data

                }
      }else{
            try{
                  const response = await axios.post(this.store, {
                      name: this.editedItem.name,
                      title: this.editedItem.title,
                      description: this.editedItem.description,
                  })
                  if(response.status === 201){
                    this.GetData()
                    this.close()
                  }
            }catch(err){
              this.snackbar = true
                console.log(err)
              this.errs = err.response.data
      
            }
      }
  }
    }

  }
</script>