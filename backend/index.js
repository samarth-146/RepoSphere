const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const Init=require('./controllers/init');
const Add=require('./controllers/add');
const Commit=require('./controllers/commit');
const Push=require('./controllers/push');
const Pull=require('./controllers/pull')
const Revert=require('./controllers/revert');

yargs(hideBin(process.argv)).command('init',"Initialise the repo",{},Init)
.command('add <file>','Add a file',(yargs)=>{
    yargs.positional('file',{
        describe:"Added file",
        type:String
    });
},(argv)=>{
    Add(argv.file);
})
.command('commit <message>','Commit a file',(yargs)=>{
    yargs.positional('message',{
        describe:'Commit',
        type:String
    })
},(argv)=>{
    Commit(argv.message)
})
.command('push','push a files',{},Push)
.command('pull',"pull a files",{},Pull)
.command('revert <Id>','Revert a file',(yargs)=>{
    yargs.positional('Id',{
        describe:"Revert",
        type:String
    })
},Revert)
.demandCommand(1).parse()
