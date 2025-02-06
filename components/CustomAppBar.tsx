import { Appbar } from 'react-native-paper'

function CustomAppBar({ title }: { title: string }) {
  return (
    <Appbar.Header>
      <Appbar.Content title={title} />
      <Appbar.Action icon="magnify" onPress={() => console.log('Buscar')} />
      <Appbar.Action
        icon="dots-vertical"
        onPress={() => console.log('Más opciones')}
      />
    </Appbar.Header>
  )
}
export default CustomAppBar
