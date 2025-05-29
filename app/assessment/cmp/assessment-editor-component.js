import { Assessment } from '../../../components/assessment.js'
import { Bead, FileBead, Thread } from '../../../components/thread.js'

export default {
    props: {
        assessment: {
            type: Assessment,
            required: true,
        },
    },
    data() {
        return {
            thread: new Thread(
                new FileBead('system', 'assess-prompt.md', '../../prompts/glossary.md'),
                new Bead('system', () => this.assessment.toString()),
            ),
        }
    },
}
