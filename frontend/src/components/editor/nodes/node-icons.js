// Import all node icons
import RoomIcon from '@/assets/Images/editor/nodeicons/Room.png'
import ItemIcon from '@/assets/Images/editor/nodeicons/Item.png'
import NPCIcon from '@/assets/Images/editor/nodeicons/NPC.png'
import PathwayIcon from '@/assets/Images/editor/nodeicons/Pathway.png'
import CustomIcon from '@/assets/Images/editor/nodeicons/Custom.png'
import PromptIcon from '@/assets/Images/editor/nodeicons/Prompt.png'
import ConsoleOutputIcon from '@/assets/Images/editor/nodeicons/ConsoleOutput.png'
import WaitIcon from '@/assets/Images/editor/nodeicons/Wait.png'
import ImageIcon from '@/assets/Images/editor/nodeicons/Image.png'
import AwaitIcon from '@/assets/Images/editor/nodeicons/Await.png'
import SetLocationIcon from '@/assets/Images/editor/nodeicons/SetLocation.png'
import SetPropertyIcon from '@/assets/Images/editor/nodeicons/SetProperty.png'
import OnPlayerEnterIcon from '@/assets/Images/editor/nodeicons/OnPlayerEnter.png'
import IfIcon from '@/assets/Images/editor/nodeicons/If.png'
import ReturnPlayerIcon from '@/assets/Images/editor/nodeicons/ReturnPlayer.png'
import RepeaterIcon from '@/assets/Images/editor/nodeicons/Repeater.png'

// Map node types to their icons
const node_icons = {
    room: RoomIcon,
    item: ItemIcon,
    npc: NPCIcon,
    pathway: PathwayIcon,
    custom: CustomIcon,
    prompt: PromptIcon,
    consoleoutput: ConsoleOutputIcon,
    wait: WaitIcon,
    image: ImageIcon,
    await: AwaitIcon,
    setlocation: SetLocationIcon,
    setproperty: SetPropertyIcon,
    playerenter: OnPlayerEnterIcon,
    if: IfIcon,
    returnplayer: ReturnPlayerIcon,
    repeater: RepeaterIcon,
}

/**
 * Get the icon for a node type. Returns Custom icon if no matching icon exists.
 * @param {string} nodeType - The type of the node (e.g., 'room', 'item', 'setlocation')
 * @returns {string} - The path to the icon image
 */
export function getNodeIcon(nodeType) {
    if (!nodeType) return CustomIcon;
    return node_icons[nodeType.toLowerCase()] || CustomIcon;
}

export default node_icons;

