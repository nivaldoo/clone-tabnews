function status(request, respose) {
  respose.status(200).json({ chave: "valor" });
}

export default status;
