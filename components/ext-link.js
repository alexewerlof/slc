/* 
This is just a convenience component to
shorten the code for external links and
reduce the risk of typo errors.
*/
export default {
    props: {
        href: String,
    },
    template: '<a :href="href" target="_blank" rel="noopener"><slot></slot></a>'
}