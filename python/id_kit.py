import secrets
import string
import base64
import io

try:
    import qrcode
except ImportError:
    qrcode = None


def generate_id(prefix: str = "ORD", length: int = 8, charset: str = "alphanumeric") -> str:
    """
    Generates a cryptographically secure random ID string.
    """
    if charset == "numeric":
        pool = string.digits
    elif charset == "alpha":
        pool = string.ascii_letters
    elif charset == "hex":
        pool = "0123456789abcdef"
    else:  # default to alphanumeric
        pool = string.ascii_uppercase + string.digits

    random_id = "".join(secrets.choice(pool) for _ in range(length))
    return f"{prefix}-{random_id}" if prefix else random_id


def generate_qr_base64(value: str) -> str:
    """
    Generates a Base64-encoded PNG Data URL for a given string value.
    Requires the `qrcode` and `Pillow` packages.
    """
    if qrcode is None:
        raise ImportError(
            "[id-qr-kit] 'qrcode' library is not installed. Install it using 'pip install qrcode pillow'."
        )

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(value)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64_str}"


def generate_kit(prefix: str = "ORD", length: int = 8) -> dict:
    """
    Creates both a unique ID and its matching QR Code Base64 string in a single call.
    """
    unique_id = generate_id(prefix=prefix, length=length)
    qr_data_url = generate_qr_base64(unique_id)
    return {
        "id": unique_id,
        "qr_data_url": qr_data_url
    }


if __name__ == "__main__":
    # Test script execution
    print("Testing Python ID Kit...")
    sample_id = generate_id(prefix="TCK", length=6)
    print(f"Generated ID: {sample_id}")
    try:
        sample_qr = generate_qr_base64(sample_id)
        print(f"Generated QR Data URL (first 50 chars): {sample_qr[:50]}...")
    except ImportError as e:
        print(f"Note: {e}")