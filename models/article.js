const mangoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema= new mangoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    senitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next){
    if(this.title){
        this.slug = slugify(this.title, { lower: true,
        strict: true })
    }

    if(this.markdown){
        this.senitizedHtml = dompurify.sanitize(marked(this.markdown))
    }

    next()
})

module.exports = mangoose.model('Article', articleSchema)