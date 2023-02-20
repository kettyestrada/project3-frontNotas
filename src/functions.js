import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function showAlert(mensaje, icono, position = '', foco = '') {
  onfocus(foco);
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    position: position,
    title: mensaje,
    icon: icono,
  });
}

export function showSuccess(mensaje) {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    position: 'top-end',
    icon: 'success',
    title: mensaje,
    showConfirmButton: false,
    timer: 1000,
  });
}

function onfocus(foco) {
  if (foco !== '') {
    document.getElementById(foco).focus();
  }
}
