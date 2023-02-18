import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function show_alerta(mensaje, icono, position = '', foco = '') {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    position: position,
    title: mensaje,
    icon: icono,
  });
}

export function show_sucess(mensaje) {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    position: 'top-end',
    icon: 'success',
    title: mensaje,
    showConfirmButton: false,
    timer: 1000,
  });
}

export function show_validate(mensaje) {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: mensaje,
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    }
  });
}

function onfocus(foco) {
  if (foco !== '') {
    document.getElementById(foco).focus();
  }
}
